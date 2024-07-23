---
title: Why almost everything you’ve read about the best Wordle starting word is wrong
tags: [Wordle]
style: 
color: 
image: /assets/images/wordle-icon.jpg
description: What's the best way to play Wordle? A few claim to use science to get the best result. But how do claims featured in the news about the "best Wordle starting words" and the "best Wordle strategies" stack up?
---

What's the best way to play Wordle? A few claim to use science to get the best result. But how do claims featured in the news about the ["best Wordle starting words"](https://www.kotaku.com.au/2022/01/science-has-figured-out-the-worst-starting-word-in-wordle/) and the ["best Wordle strategies"](https://www.theguardian.com/commentisfree/2022/jan/11/secret-winning-wordle-word-game) stack up?

## Myth #1: Using commonly used letters

The most natural way to think about minimising the number of guesses is to start with a first word that correctly guesses as many letters as possible. For that we need to choose the words that contain the most commonly occuring letters in the alphabet. Most of the articles in a recent news cycle point to TikTok users [@linguisticdiscovery](https://www.tiktok.com/@linguisticdiscovery/video/7056178088236977455) and [@crvlwanek](https://www.tiktok.com/foryou?is_copy_url=1&is_from_webapp=v1&item_id=7057703711862377775#/@crvlwanek/video/7057703711862377775) using this method, with the latter even claiming to have computed the "optimal" and "verifiable best word". 

<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@crvlwanek/video/7057703711862377775" data-video-id="7057703711862377775" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@crvlwanek" href="https://www.tiktok.com/@crvlwanek">@crvlwanek</a> <a title="stitch" target="_blank" href="https://www.tiktok.com/tag/stitch">#stitch</a> with @linguisticdiscovery Different method, similar results! <a title="wordle" target="_blank" href="https://www.tiktok.com/tag/wordle">#wordle</a> <a title="linguistics" target="_blank" href="https://www.tiktok.com/tag/linguistics">#linguistics</a> <a title="computerscience" target="_blank" href="https://www.tiktok.com/tag/computerscience">#computerscience</a> <a title="python" target="_blank" href="https://www.tiktok.com/tag/python">#python</a> <a target="_blank" title="♬ original sound - Chris" href="https://www.tiktok.com/music/original-sound-7057703706757729070">♬ original sound - Chris</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>

This approach is an example of what’s called a "greedy algorithm": one that tries to optimize some kind of score at each step - in this case, trying to maximise the number of letters found in the first word. However, it turns out that this is not the best way of determining the shortest number of guesses to the answer (to his credit, @crvlwanek [goes on](https://www.tiktok.com/@crvlwanek/video/7058746161527835951?is_copy_url=1&is_from_webapp=v1) to admit this).

You may have experienced this yourself. People are often posting their scores which have 2-3 letters correct in the first guess, but still take 5-6 guesses to find the answer! 

## Myth #2: Minimising the number of words left over is best

Another recent [article by the Independent](https://www.independent.co.uk/life-style/wordle-first-word-program-b2006070.html) points to TikTok user [@tokbyzeb](https://www.tiktok.com/@tokbyzeb/video/7058985754348866821?is_copy_url=1&is_from_webapp=v1)’s using a different greedy algorithm. His idea is to try to maximise the average number of words _eliminated_ at each step, which (hopefully) leads to the fewest number of steps to guess the solution. Twitter user [@tomjneill](https://twitter.com/tomjneill) wrote a Wordle solver tool based on this approach, which he explains [here](https://notfunatparties.substack.com/p/wordle-solver).  Both initially claim to have found the "best" starting word. 

While this is statistically superior to the letter frequency approach, in general greedy algorithms for complex problems don’t produce the optimal result. Why? Because they don’t consider the impact of the present move on future moves - they are, in a sense, short-sighted.

Here’s an example from the game of chess: taking the enemy queen whenever you have the opportunity may seem smart at first glance, since the queen is the most powerful piece on the board - but doing so might end up losing you the game. Similarly, the two greedy algorithms don’t consider how the game will play out and whether a different initial word would open up possibilities for better words down the track.

## Myth #3: It’s impossible to find the optimal strategy

So is it even possible to find the best strategy? One way would be to play out every possible game of wordle, and choose the strategy with the lowest average number of guesses to a solution. We can compute how many ways wordle can be played. We need to choose:



1. A first word (~12972 options).
2. For each possible hint (green, yellow or grey) that comes back for the first word, a second word (~243 x 12972 options)
3. For each possible hint that comes back for the second word, a third word (~243 x 12972 options)
4. And so on, up to the sixth word.

![alt_text](/assets/images/wordle-example.png "Example")

This means there are 4 sextillion (4 with 36 zeroes after it) possible strategies, far, far more than would be feasible to simulate on even the most powerful computers! For this reason, many people have reported that it’s computationally impossible to find the best strategy for Wordle.

## Impossible?

It isn't. Someone has actually already done it. That genius is a mathematician named [Alex Selby](https://twitter.com/alexselby1770?lang=en). Selby [notices](http://sonorouschocolate.com/notes/index.php?title=The_best_strategies_for_Wordle) that many potential strategies can be discarded without fully evaluating how many steps they would take, which is what allows him to compute the optimal strategy in a reasonable amount of time. He’s written and published a small [program](https://github.com/alex1770/wordle) that does this.

While his work hasn’t been peer reviewed and may contain a bug or two, the overall approach is sound. It’s highly likely it produces something which, if not the optimal solution, is very close to it.

Interestingly, the optimal strategy begins with the word SALET and requires 3.4 guesses on average. That’s actually only about 0.1 guesses better than results using the greedy techniques described above. That’s right, unless you cheat, it’s not possible to solve the game in less than 3.4 steps on average, no matter how good you are! Selby’s full strategy can be found [here](http://sonorouschocolate.com/notes/images/c/c4/Optimaltree.normalmode.txt), and contains every word you should choose at each point in the game.

## Just have fun

There are actually hundreds of words that you can start with and still get a solution in less than 3.5 steps on average. The starting word isn’t as sensitive as you might think so you can absolutely justify use your favourite word. If you’re solving the puzzle in 3 or 4 steps consistently, you’re  not too far at all from the optimal. So have fun, aim for a 3.4 guess average and know that you are, actually, pretty good at Wordle.
