package=native_libmultiprocess
$(package)_version=7d10f3b1e39caa04b3fcddebf720fd3a2b54c21d
$(package)_download_path=https://github.com/chaincodelabs/libmultiprocess/archive
$(package)_file_name=$($(package)_version).tar.gz
$(package)_sha256_hash=1e669deea827756c396e9740cac6581c3c8758e206320d359c520fc76ff31f53
$(package)_dependencies=native_capnp

define $(package)_config_cmds
  $($(package)_cmake) .
endef

define $(package)_build_cmds
  $(MAKE)
endef

define $(package)_stage_cmds
  $(MAKE) DESTDIR=$($(package)_staging_dir) install
endef
