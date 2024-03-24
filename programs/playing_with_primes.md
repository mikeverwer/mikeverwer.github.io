# Playing with Primes

This application has two major components.  One is a widget that performs and animates the Sieve of Eratosthenes, which is an ancient algorithm used to find prime numbers.  Check the link in the right sidebar for an article explaining it in more depth.  

The other is a widget that generates the Novelty numbers, which is a non-positional numbering system I came up with that is based on prime factorization.  Essentially, a novelty is just a number written as its prime factorization; but there is a twist.  The prime numbers act as the unique digits of the system, similar to how I, V, X, ... work in the Roman Numerals. We label each prime corresponding to its position in the list of all primes. For example, the number 1176 = (2^3)  * 3 * (7^2).  Therefore, it would be written as a novelty as:  

> ***1&sdot; 1&sdot; 1&sdot; 2&sdot; 4&sdot; 4***

because  2 is the *first* prime, 3 is the *second* prime, and 7 is the *fourth* prime.  
See the corresponding link for information on them as well.

The application is built with PySimpleGUI and so it's distribution is restricted according to its license.
