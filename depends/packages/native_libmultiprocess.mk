package=native_libmultiprocess
$(package)_version=86d5a45b8d2d9cca7f59056e0605e9d2d5910f61
$(package)_download_path=https://github.com/chaincodelabs/libmultiprocess/archive
$(package)_file_name=$($(package)_version).tar.gz
$(package)_sha256_hash=30208e5ea1615267f3fc5624ca89d7ea5c5271c38f6af859eb93e3129cbf6e3d
$(package)_dependencies=native_boost native_capnp

define $(package)_config_cmds
  cmake -DCMAKE_INSTALL_PREFIX=$($($(package)_type)_prefix)
endef

define $(package)_build_cmds
  $(MAKE)
endef

define $(package)_stage_cmds
  $(MAKE) DESTDIR=$($(package)_staging_dir) install
endef
