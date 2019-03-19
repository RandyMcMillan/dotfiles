#!/bin/bash

##### HEADER BEGINS #####
# scr_sys_enableARDforAdminUser.bash
#
# Created 20081231 by Miles A. Leacy IV
# miles.leacy@themacadmin.com
# Modified 20090812 by Miles A. Leacy IV
# Copyright 2009 Miles A. Leacy IV
#
# This script may be copied and distributed freely as long as this header
# remains intact.
#
# This script is provided "as is". The author offers no warranty or
# guarantee of any kind.
# Use of this script is at your own risk. The author takes no responsibility
# for loss of use,
# loss of data, loss of job, loss of socks, the onset of armageddon, or any
# other negative effects.
#
# Test thoroughly in a lab environment before use on production systems.
# When you think it's ok, test again. When you're certain it's ok, test
# twice more.
#
# This script:
# - enables the Remote Management service (ARD)
# - grants access and all privileges to the user "admin"
# - restarts the ARD agent and the ARD menu extra
#
# This script must be run as root (done automatically when deployed with
# the Casper Suite).
#
# When using the script with a Casper Suite configuration for imaging,
# set it to run At Reboot.
#
##### HEADER ENDS #####


/System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart -activate -configure -access -on -users admin -privs -all -restart -agent -menu
