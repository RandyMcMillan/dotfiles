#include <err.h>
#include <pthread.h>
#include <stdio.h>

#include "thread.h"

struct params {
	int *x;
	int max;
};

static void *inc_x(void *arg)
{
	struct params *p = arg;

	while (++(*p->x) < p->max)
		continue;

	printf("x increment finished\n");

	return NULL;
}

int thread_launch(int max)
{
	int x = 0;
	int y = 0;
	pthread_t thread;

	struct params params = {
		.x = &x,
		.max = max
	};

	printf("x = %d, y = %d\n", x, y);

	if (pthread_create(&thread, NULL, inc_x, &params)) {
		err(1, "Error creating thread");
	}

	while (++y < max)
		continue;

	printf("y increment finished\n");

	if (pthread_join(thread, NULL)) {
		err(1, "Error joining thread");
	}

	printf("x = %d, y = %d\n", x, y);

	return 0;
}
