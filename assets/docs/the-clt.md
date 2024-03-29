# The Central Limit Theorem

Suppose you are running an experiment in which the outcomes have an arbitrary probability distribution. This means that the random variable of the experiment is **not** a **Normal** random variable. It could be completely uniform where every outcome is equally likely, or some wonky curve with a whole bunch of peaks and valleys.

In this example, we use dice for which the probability of each face is set by the user, or randomized.  To reiterate, we can *not* use the Normal Distribution to predict the likely-hood of a **single** roll of this die.

Simply put, the Central Limit Theorem says; if you run this experiment $N$ times, then the ***sum***[^1]  of those $N$ outcomes will be normally distributed, as long as $N$ is large enough.  Furthermore, the mean of the sum distribution will be $N\cdot\mu$, where $\mu$ is the mean of the original die; and the standard deviation of the sum is $\sqrt{N}\cdot\sigma$, where $\sigma$ is the standard deviation of the original die.

Test it out by making a very skewed die distribution and setting the number of dice (our $N$) to be small. Press '**Show Sum Distribution**' to see how likely each possible sum is. As you increase $N$, the resulting graph should look more and more *Normal* shaped.

[1]: You can also consider the average outcome, but in this example we use the sum.
