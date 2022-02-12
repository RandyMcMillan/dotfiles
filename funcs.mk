##    example:prints this help message
example:
	@echo ""
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'
	@echo ""
	@echo ""
		@echo ""
			@echo ""
# vim: set noexpandtab:
