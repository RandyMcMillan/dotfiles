package=rapidcheck
$(package)_version=f5d3afa
$(package)_download_path=https://bitcoin-10596.firebaseapp.com/depends
$(package)_file_name=$(package)-$($(package)_version).tar.gz
$(package)_sha256_hash=78cdb8d0185b602e32e66f4e5d1a6ceec1f801dd9641b8a9456c386b1eaaf0e5

define $(package)_config_cmds
  cmake -DCMAKE_POSITION_INDEPENDENT_CODE:BOOL=true .
endef

define $(package)_build_cmds
  $(MAKE) && \
  mkdir -p $($(package)_staging_dir)$(host_prefix)/include && \
  cp -a include/* $($(package)_staging_dir)$(host_prefix)/include/ && \
  cp -a extras/boost_test/include/rapidcheck/* $($(package)_staging_dir)$(host_prefix)/include/rapidcheck/ && \
  mkdir -p $($(package)_staging_dir)$(host_prefix)/lib && \
  cp -a librapidcheck.a $($(package)_staging_dir)$(host_prefix)/lib/
endef
