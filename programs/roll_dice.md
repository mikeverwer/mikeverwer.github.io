# Roll Dice

This program was made to showcase the Central Limit Theorem, which is a seminal theorem in Statistics.  In very simple terms, the theorem states that any arbitrary probability distribution can produce a **normal** distribution if you run the procedure enough times and consider the averages (or sums in our case) of the outcomes.

The program uses rolling dice as an example.  

The user can choose an arbitrary probability distribution for the faces of a six sided die by using auto-adjusting sliders, there are also some useful presets and a randomizer.  The user also enter the number of dice to roll per trial, $n$, and the number of trials to simulate, *T*.  

Once the input for $n$ is present, you can ask the program to show the theoretical probability distribution for the sum when rolling the $n$ dice and it will display a MatPlotLib graph.  The input $n$ is the "dial" you can turn to make the resulting distribution more, or less, Normal.  If $n$ is large enough, *any* starting distribution of the dice will result in a normal distribution for the sum.  $n$ ~ 30 is usually enough for even the most extreme starting distribution to look normal.

If all inputs are present, you can ask the program to simulate the rolls. The results are then logged and displayed in a MatPlotLib graph which can be easily compared with the theoretical prediction, adn the log of the results can be scrolled through.
