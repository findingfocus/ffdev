#include <stdio.h>
#define LINES 25

const char *Prayer[LINES];

int main()
{
	printf("%s\n", Prayer[0]);
	char input;
	for (int i = 1; i < LINES; i++)
	{
		scanf("%c", &input);
		if (input == 10)
		{
			printf("%s\n", Prayer[i]);
		}
	}
}

const char *Prayer[] = {
"O Great Muse",
"Gift us with your presence",
"And we shall commit to the work of showing up",
"Let us handle the quantity, and you handle the quality",
"Help us love ourselves so we can love others",
"Help us grow so we can help others grow",
"Please alert us when we are on the wrong path",
"By showing us interesting new directions to follow",
"Let us not get wrapped up in the end product, but in the process itself",
"Help us love the present and work out of it not for an imaginary future",
"But to make art for its own sake and its own beauty",
"Grant us the courage to try, and the confidence for having done so",
"Help us unite with other creators so we can encourage each other",
"If we are depressed, help us cling to what is beautiful in the moment",
"And help nudge us towards contentment even in difficult times",
"We promise to offer our work to you consistently",
"And we will listen to where our hearts tell us to go",
"We dedicate our creations to you and they do not belong to us",
"For we were only gifted the idea through the ether",
"And we are merely forging it and returning it to the universe",
"Allow us to realize we all deserve love",
"And that we are all the same divine light",
"We cannot be alone when we realize this",
"We create in honor of each other's divinity",
"Please accept our gifts as they are only made possible through your grace"
};