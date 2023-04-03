// Copyright (c) 2011-2022 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#if defined(HAVE_CONFIG_H)
#include <config/bitcoin-config.h>
#endif

#include <chainparams.h>
#include <fs.h>
#include <qt/intro.h>
#include <qt/forms/ui_intro.h>

#include <qt/guiconstants.h>
#include <qt/guiutil.h>
#include <qt/optionsmodel.h>

#include <interfaces/node.h>
#include <util/system.h>
#include <validation.h>

#include <QFileDialog>
#include <QSettings>
#include <QMessageBox>

#include <cmath>
#include <fstream>

/* Check free space asynchronously to prevent hanging the UI thread.

   Up to one request to check a path is in flight to this thread; when the check()
   function runs, the current path is requested from the associated Intro object.
   The reply is sent back through a signal.

   This ensures that no queue of checking requests is built up while the user is
   still entering the path, and that always the most recently entered path is checked as
   soon as the thread becomes available.
*/
class FreespaceChecker : public QObject
{
    Q_OBJECT

public:
    explicit FreespaceChecker(Intro *intro);

    enum Status {
        ST_OK,
        ST_ERROR
    };

public Q_SLOTS:
    void check();

Q_SIGNALS:
    void reply(int status, const QString &message, quint64 available);

private:
    Intro *intro;
};

#include <qt/intro.moc>

FreespaceChecker::FreespaceChecker(Intro *_intro)
{
    this->intro = _intro;
}

void FreespaceChecker::check()
{
    QString dataDirStr = intro->getPathToCheck();
    fs::path dataDir = GUIUtil::QStringToPath(dataDirStr);
    uint64_t freeBytesAvailable = 0;
    int replyStatus = ST_OK;
    QString replyMessage = tr("A new data directory will be created.");

    /* Find first parent that exists, so that fs::space does not fail */
    fs::path parentDir = dataDir;
    fs::path parentDirOld = fs::path();
    while(parentDir.has_parent_path() && !fs::exists(parentDir))
    {
        parentDir = parentDir.parent_path();

        /* Check if we make any progress, break if not to prevent an infinite loop here */
        if (parentDirOld == parentDir)
            break;

        parentDirOld = parentDir;
    }

    try {
        freeBytesAvailable = fs::space(parentDir).available;
        if(fs::exists(dataDir))
        {
            if(fs::is_directory(dataDir))
            {
                QString separator = "<code>" + QDir::toNativeSeparators("/") + tr("name") + "</code>";
                replyStatus = ST_OK;
                replyMessage = tr("Directory already exists. Add %1 if you intend to create a new directory here.").arg(separator);
            } else {
                replyStatus = ST_ERROR;
                replyMessage = tr("Path already exists, and is not a directory.");
            }
        }
    } catch (const fs::filesystem_error&)
    {
        /* Parent directory does not exist or is not accessible */
        replyStatus = ST_ERROR;
        replyMessage = tr("Cannot create data directory here.");
    }
    Q_EMIT reply(replyStatus, replyMessage, freeBytesAvailable);
}

namespace {
//! Return pruning size that will be used if automatic pruning is enabled.
int GetPruneTargetGB()
{
    int64_t prune_target_mib = gArgs.GetIntArg("-prune", 0);
    // >1 means automatic pruning is enabled by config, 1 means manual pruning, 0 means no pruning.
    return prune_target_mib > 1 ? PruneMiBtoGB(prune_target_mib) : DEFAULT_PRUNE_TARGET_GB;
}
} // namespace

Intro::Intro(QWidget *parent, int64_t blockchain_size_gb, int64_t chain_state_size_gb) :
    QDialog(parent, GUIUtil::dialog_flags),
    ui(new Ui::Intro),
    m_blockchain_size_gb(blockchain_size_gb),
    m_chain_state_size_gb(chain_state_size_gb),
    m_prune_target_gb{GetPruneTargetGB()}
{
    ui->setupUi(this);
    ui->welcomeLabel->setText(ui->welcomeLabel->text().arg(PACKAGE_NAME));
    ui->storageLabel->setText(ui->storageLabel->text().arg(PACKAGE_NAME));

    ui->lblExplanation1->setText(ui->lblExplanation1->text()
        .arg(PACKAGE_NAME)
        .arg(m_blockchain_size_gb)
        .arg(2009)
        .arg(tr("Bitcoin"))
    );
    ui->lblExplanation2->setText(ui->lblExplanation2->text().arg(PACKAGE_NAME));

    const int min_prune_target_GB = std::ceil(MIN_DISK_SPACE_FOR_BLOCK_FILES / 1e9);
    ui->pruneGB->setRange(min_prune_target_GB, std::numeric_limits<int>::max());
    if (gArgs.GetIntArg("-prune", 0) > 1) { // -prune=1 means enabled, above that it's a size in MiB
        ui->prune->setChecked(true);
        ui->prune->setEnabled(false);
    }
    ui->pruneGB->setValue(m_prune_target_gb);
    ui->pruneGB->setToolTip(ui->prune->toolTip());
    ui->lblPruneSuffix->setToolTip(ui->prune->toolTip());
    UpdatePruneLabels(ui->prune->isChecked());

    connect(ui->prune, &QCheckBox::toggled, [this](bool prune_checked) {
        UpdatePruneLabels(prune_checked);
        UpdateFreeSpaceLabel();
    });
    connect(ui->pruneGB, qOverload<int>(&QSpinBox::valueChanged), [this](int prune_GB) {
        m_prune_target_gb = prune_GB;
        UpdatePruneLabels(ui->prune->isChecked());
        UpdateFreeSpaceLabel();
    });

    startThread();
}

Intro::~Intro()
{
    delete ui;
    /* Ensure thread is finished before it is deleted */
    thread->quit();
    thread->wait();
}

QString Intro::getDataDirectory()
{
    return ui->dataDirectory->text();
}

void Intro::setDataDirectory(const QString &dataDir)
{
    ui->dataDirectory->setText(dataDir);
    if(dataDir == GUIUtil::getDefaultDataDirectory())
    {
        ui->dataDirDefault->setChecked(true);
        ui->dataDirectory->setEnabled(false);
        ui->ellipsisButton->setEnabled(false);
    } else {
        ui->dataDirCustom->setChecked(true);
        ui->dataDirectory->setEnabled(true);
        ui->ellipsisButton->setEnabled(true);
    }
}

int64_t Intro::getPruneMiB() const
{
    switch (ui->prune->checkState()) {
    case Qt::Checked:
        return PruneGBtoMiB(m_prune_target_gb);
    case Qt::Unchecked: default:
        return 0;
    }
}

// TODO move to common/init
// TODO write new file before renaming old so less fragile
// TODO choose better unique filename
bool SetInitialDataDir(const fs::path& default_datadir, const fs::path& datadir, std::string& error)
{
    assert(default_datadir.is_absolute());
    assert(datadir.is_absolute());
    const bool link_datadir{datadir == default_datadir};
    std::error_code ec;
    fs::file_status status{fs::symlink_status(default_datadir, ec)};
    if (ec) {
        error = strprintf("Could not read %s: %s", fs::quoted(fs::PathToString(default_datadir)), ec.message());
        return false;
    }
    if (status.type() != fs::file_type::not_found && (link_datadir || status.type() != fs::file_type::directory)) {
        fs::path prev_datadir{default_datadir};
        prev_datadir += strprintf(".%d.bak", GetTime());
        fs::rename(default_datadir, prev_datadir, ec);
        if (ec) {
            error = strprintf("Could not rename %s to %s: %s", fs::quoted(fs::PathToString(default_datadir)), fs::quoted(fs::PathToString(prev_datadir)), ec.message());
            return false;
        }
    }
    if (link_datadir) {
        fs::create_directory_symlink(datadir, default_datadir, ec);
        if (ec) {
            if (ec != std::errc::operation_not_permitted) {
                LogPrintf("Could not create symlink to %s at %s: %s", fs::quoted(fs::PathToString(datadir)), fs::quoted(fs::PathToString(default_datadir)), ec.message());
            }
            std::ofstream file;
            file.exceptions(std::ifstream::failbit | std::ifstream::badbit);
            try {
                file.open(datadir);
                file << fs::PathToString(datadir) << std::endl;
            } catch (std::system_error& e) {
                ec = e.code();
            }
            if (ec) {
                error = strprintf("Could not write %s to %s: %s", fs::quoted(fs::PathToString(datadir)), fs::quoted(fs::PathToString(default_datadir)), ec.message());
                return false;
            }
        }
    } else {
        if (!CreateDataDir(datadir, error)) return false;
    }
    return true;
}

// TODO move low level code out of showIfNeeded to this function
// TODO move common/init, consolidate arguments/return value
fs::path GetInitialDataDir(const ArgsManager& args, bool& explicit_datadir, bool& new_datadir, bool& custom_datadir, std::string& error)
{
    return {};
}

bool Intro::showIfNeeded(bool& did_show_intro, fs::path& initial_datadir, int64_t& prune_MiB)
{
    // Always show intro if requested.
    bool show_intro{gArgs.GetBoolArg("-choosedatadir", DEFAULT_CHOOSE_DATADIR) || gArgs.GetBoolArg("-resetguisettings", false)};

    // Check if explicit -datadir command line argument was passed. If it was,
    // just use the value for the current session and avoid changing the default
    // datadir that will be used in future sessions. Also avoid showing the
    // intro dialog if it was not was explicitly requested with -choosedatadir
    // or -resetguisettings.
    fs::path datadir{gArgs.GetPathArg("-datadir")};
    fs::path default_datadir = GetDefaultDataDir();
    bool explicit_datadir{false}, new_datadir{false}, custom_datadir{false};
    QSettings settings;
    std::error_code ec;
    if (!datadir.empty()) {
        explicit_datadir = true;
    } else {
        if (settings.value("fReset", false).toBool()) show_intro = true;

        fs::file_status status = fs::symlink_status(default_datadir, ec);
        if (status.type() == fs::file_type::not_found) {
            new_datadir = true;
            datadir = default_datadir;
        } else if (status.type() == fs::file_type::regular) {
            std::ifstream file;
            file.exceptions(std::ifstream::failbit | std::ifstream::badbit);
            std::string line;
            try {
                file.open(datadir);
                std::getline(file, line);
            } catch (std::system_error& e) {
                ec = e.code();
            }
            datadir = ec ? default_datadir : fs::PathFromString(line);
            custom_datadir = true;
        } else if (status.type() == fs::file_type::symlink) {
            datadir = fs::read_symlink(default_datadir, ec);
            custom_datadir = true;
        } else if (status.type() != fs::file_type::directory) {
            ec = make_error_code(std::errc::not_a_directory);
        }
    }

    // Check if there is a legacy QSettings "strDataDir" setting that should be
    // migrated.
    QVariant legacy_datadir_str{settings.value("strDataDir")};
    bool remove_legacy_setting{false};
    // TODO consolidate cases below, set remove_legacy_setting in one place
    if (legacy_datadir_str.isValid()) {
        fs::path legacy_datadir{fs::PathFromString(legacy_datadir_str.toString().toStdString()).lexically_normal()};
        if (explicit_datadir) {
            // If explicit -datadir was passed, let the explicit value take
            // priority over the legacy value. Discard the legacy value if the
            // intro dialog is shown and completed, otherwise keep the legacy
            // value so it can be used when -datadir is not passed.
            if (show_intro) remove_legacy_setting = true;
        } else if (legacy_datadir.empty() || legacy_datadir == datadir || legacy_datadir == default_datadir) {
            // If the legacy datadir string is empty, or the same as the current
            // datadir, just discard the legacy value.
            remove_legacy_setting = true;
        } else if (new_datadir) {
            // If there is no current datadir, use the legacy datadir.
            datadir = legacy_datadir;
            remove_legacy_setting = true;
            // If showing intro dialog, legacy setting will be shown in the
            // dialog and saved in the dialog is completed. If not showing
            // intro, try to save legacy datadir as default now. If it fails to
            // save, just log a warning. It will still be used this session, and
            // the legacy setting will be kept so there is a chance to retry the
            // next session.
            std::string error;
            if (show_intro) {
                remove_legacy_setting = true;
            } else if (SetInitialDataDir(default_datadir, datadir, error)) {
                remove_legacy_setting = true;
            } else {
                LogPrintf("Warning: failed to set %s as default data directory: %s", fs::quoted(fs::PathToString(datadir)), error);
            }
        } else if (show_intro) {
            // If legacy datadir conflicts with current datadir, but the intro
            // dialog is going to be shown, just discard the legacy datadir if
            // the intro dialog is completed. instead of showing an extra dialog
            // before the intro.
            remove_legacy_setting = true;
        } else {
            // Show a dialog to choose between the legacy and current datadirs.
            QString gui_datadir{QString::fromStdString(fs::PathToString(legacy_datadir))};
            QString cli_datadir{QString::fromStdString(fs::PathToString(datadir.empty() ? default_datadir : datadir))};
            #define Dialog(...)
            Dialog(R"(
                The Bitcoin graphical interface (GUI) is configured to use a different default data directory than Bitcoin command line (CLI) tools.

                    GUI default data directory is: {legacy_datadir}
                    CLI default data directory is: {current_datadir}

                Previous versions of the Bitcoin GUI (24.x and earlier) only used the GUI default directory and ignored the CLI default directory. This version allows choosing which of the two directories to use. It is recommended to set a common default data directory so the GUI and CLI tools such as `bitcoind` `bitcoin-cli` and `bitcoin-wallet` can interoperate and this prompt can be avoided in the future.

                Use GUI data directory and leave defaults unchanged (Same as bitcoin 24.x behavior)
                Use CLI data directory and leave defaults unchanged
                Use GUI data directory and set as common default
                Use CLI data directory and set as common default
                Choose another data directory and set as default...
                Quit
            )");
            enum {USE_GUI, USE_CLI, SET_GUI_DEFAULT, SET_CLI_DEFAULT, QUIT};
            if (USE_GUI) {
                datadir = legacy_datadir;
                custom_datadir = true;
                new_datadir = false;
            } else if (USE_CLI) {
            } else if (SET_GUI_DEFAULT) {
                datadir = legacy_datadir;
                custom_datadir = true;
                new_datadir = false;
                std::string error;
                if (SetInitialDataDir(default_datadir, datadir, error)) {
                    remove_legacy_setting = true;
                } else {
                    LogPrintf("Warning: failed to set %s as default data directory: %s", fs::quoted(fs::PathToString(datadir)), error);
                }
            } else if (SET_CLI_DEFAULT) {
                remove_legacy_setting = true;
            } else if (QUIT) {
                return false;
            }
        }
    }

    // If a default or explicit datadir does not exist just show the intro
    // dialog to confirm it should be created. But if a custom datadir that was
    // previously selected in the GUI no longer exists, show a dialog to notify
    // about the problem, since it could happen when an external drive is not
    // attached, and choosing a new datadirectory would not be desirable.
    std::string message;
    if (custom_datadir) {
        if (datadir.is_absolute()) {
            fs::file_status status = fs::status(datadir, ec);
            if (status.type() != fs::file_type::directory) {
                message = strprintf("Data directory path %s no longer exists or is not a directory", fs::quoted(fs::PathToString(datadir)));
                if (!ec && status.type() == fs::file_type::not_found) ec = std::make_error_code(std::errc::no_such_file_or_directory);
                if (ec) message = strprintf("%s: %s", message, ec.message());
                Dialog(R"(
                Retry
                Choose a new data directory location
                Quit
               )");
            }
        } else {
            // Error will be displayed in intro dialog
            ec = std::make_error_code(std::errc::not_a_directory);
        }
    }

    did_show_intro = false;

    if (new_datadir) show_intro = true;

    if (show_intro) {
        /* Use selectParams here to guarantee Params() can be used by node interface */
        try {
            SelectParams(gArgs.GetChainName());
        } catch (const std::exception&) {
            return false;
        }

        /* If current default data directory does not exist, let the user choose one */
        Intro intro(nullptr, Params().AssumedBlockchainSize(), Params().AssumedChainStateSize());
        intro.setDataDirectory(QString::fromStdString(fs::PathToString(datadir)));
        intro.setWindowIcon(QIcon(":icons/bitcoin"));
        if (ec) intro.setStatus(FreespaceChecker::ST_ERROR, QString::fromStdString(ec.message()), 0);
        did_show_intro = true;

        while(true)
        {
            if(!intro.exec())
            {
                /* Cancel clicked */
                return false;
            }
            datadir = fs::PathFromString(intro.getDataDirectory().toStdString());
            std::string error;
            if (!datadir.is_absolute()) {
                intro.setStatus(FreespaceChecker::ST_ERROR, QString::fromStdString("Data directory is not an absolute path."), 0);
            } else if (!CreateDataDir(datadir, error)) {
                intro.setStatus(FreespaceChecker::ST_ERROR, QString::fromStdString(strprintf("Could not create data directory: %s", error)), 0);
            } else if (!SetInitialDataDir(default_datadir, datadir, error)) {
                intro.setStatus(FreespaceChecker::ST_ERROR, QString::fromStdString(strprintf("Could not set default datadirectory: %s", error)), 0);
            } else {
                show_intro = false;
            }
        }

        // Additional preferences:
        prune_MiB = intro.getPruneMiB();
    }

    // Save initial datadir so init code can use it to locate bitcoin.conf
    // (which can point to another datadir). If an explicit -datadir command
    // line argument was passed and a different datadir was chosen after that in
    // one of the dialogs dialogs here, call ForceSet to make the dialog value
    // override the command line argument.
    initial_datadir = datadir;
    if (explicit_datadir) gArgs.ForceSetArg("-datadir", PathToString(initial_datadir));

    settings.setValue("fReset", false);
    if (remove_legacy_setting) settings.remove("strDataDir");

    return true;
}

void Intro::setStatus(int status, const QString &message, quint64 bytesAvailable)
{
    switch(status)
    {
    case FreespaceChecker::ST_OK:
        ui->errorMessage->setText(message);
        ui->errorMessage->setStyleSheet("");
        break;
    case FreespaceChecker::ST_ERROR:
        ui->errorMessage->setText(tr("Error") + ": " + message);
        ui->errorMessage->setStyleSheet("QLabel { color: #800000 }");
        break;
    }
    /* Indicate number of bytes available */
    if(status == FreespaceChecker::ST_ERROR)
    {
        ui->freeSpace->setText("");
    } else {
        m_bytes_available = bytesAvailable;
        if (ui->prune->isEnabled() && !(gArgs.IsArgSet("-prune") && gArgs.GetIntArg("-prune", 0) == 0)) {
            ui->prune->setChecked(m_bytes_available < (m_blockchain_size_gb + m_chain_state_size_gb + 10) * GB_BYTES);
        }
        UpdateFreeSpaceLabel();
    }
    /* Don't allow confirm in ERROR state */
    ui->buttonBox->button(QDialogButtonBox::Ok)->setEnabled(status != FreespaceChecker::ST_ERROR);
}

void Intro::UpdateFreeSpaceLabel()
{
    QString freeString = tr("%n GB of space available", "", m_bytes_available / GB_BYTES);
    if (m_bytes_available < m_required_space_gb * GB_BYTES) {
        freeString += " " + tr("(of %n GB needed)", "", m_required_space_gb);
        ui->freeSpace->setStyleSheet("QLabel { color: #800000 }");
    } else if (m_bytes_available / GB_BYTES - m_required_space_gb < 10) {
        freeString += " " + tr("(%n GB needed for full chain)", "", m_required_space_gb);
        ui->freeSpace->setStyleSheet("QLabel { color: #999900 }");
    } else {
        ui->freeSpace->setStyleSheet("");
    }
    ui->freeSpace->setText(freeString + ".");
}

void Intro::on_dataDirectory_textChanged(const QString &dataDirStr)
{
    /* Disable OK button until check result comes in */
    ui->buttonBox->button(QDialogButtonBox::Ok)->setEnabled(false);
    checkPath(dataDirStr);
}

void Intro::on_ellipsisButton_clicked()
{
    QString dir = QDir::toNativeSeparators(QFileDialog::getExistingDirectory(nullptr, "Choose data directory", ui->dataDirectory->text()));
    if(!dir.isEmpty())
        ui->dataDirectory->setText(dir);
}

void Intro::on_dataDirDefault_clicked()
{
    setDataDirectory(GUIUtil::getDefaultDataDirectory());
}

void Intro::on_dataDirCustom_clicked()
{
    ui->dataDirectory->setEnabled(true);
    ui->ellipsisButton->setEnabled(true);
}

void Intro::startThread()
{
    thread = new QThread(this);
    FreespaceChecker *executor = new FreespaceChecker(this);
    executor->moveToThread(thread);

    connect(executor, &FreespaceChecker::reply, this, &Intro::setStatus);
    connect(this, &Intro::requestCheck, executor, &FreespaceChecker::check);
    /*  make sure executor object is deleted in its own thread */
    connect(thread, &QThread::finished, executor, &QObject::deleteLater);

    thread->start();
}

void Intro::checkPath(const QString &dataDir)
{
    mutex.lock();
    pathToCheck = dataDir;
    if(!signalled)
    {
        signalled = true;
        Q_EMIT requestCheck();
    }
    mutex.unlock();
}

QString Intro::getPathToCheck()
{
    QString retval;
    mutex.lock();
    retval = pathToCheck;
    signalled = false; /* new request can be queued now */
    mutex.unlock();
    return retval;
}

void Intro::UpdatePruneLabels(bool prune_checked)
{
    m_required_space_gb = m_blockchain_size_gb + m_chain_state_size_gb;
    QString storageRequiresMsg = tr("At least %1 GB of data will be stored in this directory, and it will grow over time.");
    if (prune_checked && m_prune_target_gb <= m_blockchain_size_gb) {
        m_required_space_gb = m_prune_target_gb + m_chain_state_size_gb;
        storageRequiresMsg = tr("Approximately %1 GB of data will be stored in this directory.");
    }
    ui->lblExplanation3->setVisible(prune_checked);
    ui->pruneGB->setEnabled(prune_checked);
    static constexpr uint64_t nPowTargetSpacing = 10 * 60;  // from chainparams, which we don't have at this stage
    static constexpr uint32_t expected_block_data_size = 2250000;  // includes undo data
    const uint64_t expected_backup_days = m_prune_target_gb * 1e9 / (uint64_t(expected_block_data_size) * 86400 / nPowTargetSpacing);
    ui->lblPruneSuffix->setText(
        //: Explanatory text on the capability of the current prune target.
        tr("(sufficient to restore backups %n day(s) old)", "", expected_backup_days));
    ui->sizeWarningLabel->setText(
        tr("%1 will download and store a copy of the Bitcoin block chain.").arg(PACKAGE_NAME) + " " +
        storageRequiresMsg.arg(m_required_space_gb) + " " +
        tr("The wallet will also be stored in this directory.")
    );
    this->adjustSize();
}
