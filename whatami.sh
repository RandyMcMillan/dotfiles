#!/bin/sh
#
# Script tests the operating system for some interesting information.
# Idea and concept from a script by Wayne Thommpson, for Sun
# workstations. Attempts to modify the script for Linux unsuccessful
# and this is mostly completely rewritten.
#
# Written by: CMDRae, January 2002
#
PATH=/bin:/usr/bin:/usr/local/bin:/usr/X11R6/bin:/sbin:/usr/sbin:/usr/local/sbin
#

DMESG=dmesg


function macos_device (){

    if [[ "$(uname)" == "Darwin"* ]]; then
    # ioreg -l | grep -v PCI
    ioreg -l | grep com.apple.$KIT > iokit.log
    # ioreg -l | grep -v IOKitDiagnostics
    fi
}

if [ -f /var/log/dmesg ] ; then
        DMESG="cat /var/log/dmesg"
elif [ -f /var/log/boot.msg ] ; then
        DMESG="cat /var/log/boot.msg"
fi


############ This script information ########################
echo "###  QUERY     ###"
echo "             DATE: " `date`
echo "             USER: " `whoami`

########### HARDWARE ########################################
echo "###  HARDWARE  ###"
echo "ARCHITECTURE TYPE: " `arch`
cat /proc/cpuinfo | tac |
	awk '
	/^processor/{print "        PROCESSOR: ",$3,"=",vend,mod,spd,"MHz"}
	/^model name/{mod=gensub(/^[[:alpha:][:blank:]]*:/,"",1)}
	/^vendor_id/{vend=gensub(/^[[:alpha:][:blank:]_]*:/,"",1)}
	/^cpu MHz/{spd=gensub(/^[[:alpha:][:blank:]]*:/,"",1)}
	' | tac
HOSTID=`hostid 2>&-` && echo "          HOST ID:  "$HOSTID

#
# MEMORY
#
if [[ "$OSTYPE" == "linux"* ]]; then

cat /proc/meminfo | awk '/MemTotal:/{sub(/MemTotal:   /,""); print "     TOTAL MEMORY: ",$0}'
cat /proc/meminfo | awk '/MemFree:/{sub(/MemFree:    /,""); print "      FREE MEMORY: ",$0}'
cat /proc/meminfo | awk '/SwapTotal:/{sub(/SwapTotal:  /,""); print "       TOTAL SWAP: ",$0}'
cat /proc/meminfo | awk '/SwapFree:/{sub(/SwapFree:   /,""); print "        FREE SWAP: ",$0}'
swapon -s | awk 'NR>1{print "      SWAP DEVICE: ",$2 "=" $1 ", " int($3/1024+0.5) "MiB"}'
fi
if [[ "$(uname)" == "Darwin"* ]]; then
    if hash vm_stat 2>/dev/null; then
    vm_stat
    ls -l /var/vm
    fi
fi
#
# DRIVES
#
if [[ "$OSTYPE" == "linux"* ]]; then
    for drive in `echo /dev/hd[a-z]|sed 's/\/dev\///g'`; do
        [ "$DMESG" ] &&
        $DMESG | grep ^$drive | awk 'NR==1{print "       IDE DEVICE: ",$0}NR==2{print "  DEVICE GEOMETRY: ",$0}'
    done

    SCSI=`$DMESG | awk '/^scsi[0-9]/{print $1}'`
    for f in $SCSI; do
        $DMESG | awk '/^'$f'/{print "      SCSI DEVICE: ",$0}'
    done

#
# NETWORK CARD
#

if [ "$DMESG" ]; then
    $DMESG | awk '/^[[:blank:]]*arc[0-9]|^[[:blank:]]*eth[0-9]/{	\
	if ($0~/IRQ/){print "     NETWORK CARD: ", $0}}'
fi
fi

if [[ "$(uname)" == "Darwin"* ]]; then
#REF: https://eclecticlight.co/2016/10/01/using-the-logs-in-sierra-some-practical-tips/
echo
fi

################### NETWORK ##################################
## HOSTNAMES and INTERFACES
#

ifaces=` ifconfig | cut -b-10 | awk '!/^[[:blank:]]*$|^lo/{print $1}' `

for iface in $ifaces
do
    ip=`
        ifconfig $iface 2>&- |
        awk ' $1 == "inet" { gsub(/[[:alpha:]:]/,""); print $1; } '
    `

    nm=`
        ifconfig $iface 2>&- |
        awk ' $1 == "inet" { gsub(/[[:alpha:]:]/,""); print $3; } '
    `
    hw=`
	ifconfig $iface 2>&- |
	awk '/HWaddr/{match($0,/HWaddr.*$/);
	     	      hwaddr=substr($0,RSTART,RLENGTH);
	     	      sub(/HWaddr /,"",hwaddr);print hwaddr}'
    `

    [ $ip ] && ( grep -w $ip /etc/hosts || echo "$ip [unnamed]" ) |
    awk '
        {
            printf ("%'$offset's %s = %s\n"\
                , "         HOSTNAME: "   \
                , "'"$iface"'"  \
                , $2            \
            );
        }

        END {
            printf ("%'$offset's %s = %s\n"\
                , "       IP ADDRESS: " \
                , "'"$iface"'"  \
                , "'"$ip"'"     \
            );
            printf ("%'$offset's %s = %s\n"\
                , "     NETWORK MASK: " \
                , "'"$iface"'"  \
                , "'"$nm"'"     \
	    );
            printf ("%'$offset's %s = %s\n"\
                , " ETHERNET ADDRESS: " \
                , "'"$iface"'"  \
                , "'"$hw"'"     \
	    );
        }
    '
done


### END of HOSTNAMES and INTERFACES


################# STORAGE ####################
#
# LOCAL DISKS
#
Drive=` mount | grep ^/dev | awk '{sub(/\/dev\//,"",$1);gsub(/[[:digit:]]/,"",$1); print $1}' | sort | uniq `


if [[ "$OSTYPE" == "linux"* ]]; then
# Partition=` mount | grep ^/dev | awk '{print $1}' `
Partition=` mount | grep ^/dev | awk '{print $3}' `

for drive in $Drive; do
    echo "$drive"
	for partition in $Partition; do
        df $partition |
            awk '/'${drive/\//\\/}'/{print "        PARTITION: ",$1,"mounted on",$6,"(" int($2/1024) "MiB, " $5 " full)"}'
	done
done
fi

#
# REMOTE MOUNTS
#


mount -t nfs,smb | awk '{print "    NETWORK MOUNT: ",$1,"mounted",$2,$3}'
if [ -e /etc/exports ]; then
    (
 	showmount -d 2>&- || cat /etc/exports |
	awk '/^[[:blank:]]*[^#]/{print $1}{while(/\\$/){getline}}'
    ) | awk 'NR>1{print "        EXPORTING: ", $1}'
fi

### END of DISKS

smbclient -N -L $HOSTNAME < /dev/null 2> /dev/null |
	awk '
	/^Domain/{
		wg=gensub(/^[^\[]*\[([^\]]*).*$/,"\\1",1);
		print "        WORKGROUP: ",wg
		}
	/^[[:blank:]]*$/{st=0}
	st{
		sub(/^[[:blank:]]*/,"");
		share=gensub(/[[:blank:]]+/,",","1");
		share=gensub(/[[:blank:]]+/,",","1",share);
		print "            SHARE: ", share
		}
	/^[[:blank:]]*Sharename/{st=1; getline}
	'

############ DISPLAY #######################################

# only interested in the video graphics card right now. Probably want to
# print out all the pci device information, which obtained by lspci
if [[ "$OSTYPE" == "linux"* ]]; then
test lspci && lspci | grep -i "display\|vga"| sed 's/^[0-9a-f]\{2\}:[0-9a-f]\{2\}.[0-9]/          DISPLAY: /' || echo
fi

if [[ "$(uname)" == "Darwin"* ]]; then
# ioreg -l | grep -v PCI
# ioreg -l | grep com.apple.iokit
$KIT = iokit
macos_device
# ioreg -l | grep -v IOKitDiagnostics
fi

############ OPERATING SYSTEM ###############################
echo "###  SOFTWARE  ###"
echo "    SYSTEM KERNEL: " `uname -sr`
#
echo "           UPTIME: " `uptime|awk '{ sub(/.*/,"",$2); sub(/.*/,"",$1); print}'`
#
[ -e /etc/slackware-version ] &&
echo "BASE DISTRIBUTION:  Slackware "`cat /etc/slackware-version`
[ -e /etc/redhat-release ] &&
echo "     DISTRIBUTION: " `cat /etc/redhat-release`
[ -e /etc/debian_version ] &&
echo "     DISTRIBUTION: " Debian `cat /etc/debian_version`
[ -e /etc/SuSE-release ] &&
echo "     DISTRIBUTION: " `head -n1 /etc/SuSE-release`
                # 'Mandrake'
[ -e /etc/mandrake-release ] &&
echo "     DISTRIBUTION: " `head -n1 /etc/mandrake-release`

DISTFILE=/etc/lsb-release
if [ -x "`which lsb_release 2> /dev/null`" ] ; then
	lsb_release -a
elif [ -e $DISTFILE ] ; then
	cat $DISTFILE | awk '/DISTRIB_ID/{printf "%20s%s\n"," ",$0}'
	cat $DISTFILE | awk '/DISTRIB_RELEASE/{printf "%20s%s\n"," ",$0}'
	cat $DISTFILE | awk '/DISTRIB_CODENAME/{printf "%20s%s\n"," ",$0}'
fi

( gcc -dumpversion >/dev/null 2>/dev/null ) &&
echo "      GCC VERSION: " `gcc -dumpversion`

VIM_EXEC=`which vim`
[ -x "$VIM_EXEC" ] &&
echo "      VIM VERSION: " `vim --version | head -1 2>&1 | sed 's/VIM - Vi IMproved//' `

MATLAB_EXEC=`which matlab 2> /dev/null`
[ -x "$MATLAB_EXEC" ] &&
echo "   MATLAB VERSION: " `matlab -help | grep Revision`

PYTHON_EXEC=`which python`
[ -x "$PYTHON_EXEC" ] &&
echo "   PYTHON VERSION: " `python --version 2>&1 | sed 's/[Pp]ython//' `

PYTHON3_EXEC=`which python3`
[ -x "$PYTHON3_EXEC" ] &&
echo "  PYTHON3 VERSION: " `python3 --version 2>&1 | sed 's/[Pp]ython//' `

BREW_EXEC=`which brew`
[ -x "$BREW_EXEC" ] &&
echo "     BREW VERSION: " `brew --version | head -1 2>&1 | sed 's/[Hh]ome//' | sed 's/macOS *//' `

# vim: se nowrap tw=0 :
