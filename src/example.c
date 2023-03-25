#include <stdio.h>
#include <stdlib.h>

#include "thread.h"

extern char *__progname;

static void usage(void)
{
	fprintf(stderr, "usage: %s number\n", __progname);
	exit(1);
}

int main(int argc, char **argv)
{
	int arg;

	if (argc < 2)
		usage();

	arg = atoi(argv[1]);

	if (arg <= 0)
		return 1;

	return thread_launch(arg);
}
