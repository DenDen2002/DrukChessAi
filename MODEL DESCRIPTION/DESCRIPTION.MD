How do normal chess engines work?
Normal chess engines work with the minimax algorithm: the engine tries to find the best move by creating a tree of all possible moves to a certain depth, and cutting down paths that lead to bad positions (alpha-beta pruning). It evaluates a position based on which pieces are on the board.


How does my chess engine work?
This chess engine is based on AlphaZero by Deepmind. It uses a neural network to predict the next best move. The neural network learns by playing against itself for a high amount of games, and using their results to train the network. The newly trained neural network is evaluated against the old network by playing many games against each other, and the best network is kept. This process is repeated for a long time.

Playing one move

The neural network
Input layer: 19 8x8 boards of booleans
Input example

20 hidden layers:
Convolutional hidden layer
19 residual blocks with skip-connections
2 outputs:
The win probabilities of each move (73 boards of 8x8 floats)
The value of the given board (scalar)
Output example

=> 30+ million parameters

A visual representation of the model can be found in ./models/model.png

Every move, run a high number amount of MCTS simulations. AlphaZero uses an custom version of MCTS.

Normal Monte Carlo Tree Search:

Selection: Traverse the tree randomly until a leaf node is reached.
Expansion: expand the leaf node by creating a child for every possible action
Simulation: 'rollout' the game by randomly choosing moves until the end of the game.
Backpropagation: backpropagate the result of the rollout to the root node.
In chess, normal MCTS would be incredibly inefficient, because the amount of actions every position can have is too high (step 1), and the length of the game can be very long when choosing random moves (step 3).

Monte Carlo Tree Search


AlphaZero's MCTS
AlphaZero uses a different kind of MCTS:

step 1 (Selection) is not random, but based on neural network predictions and upper confidence bound
step 3 (Simulation) is replaced by the value prediction received by the neural network (Evaluation)
MCTS steps for 1 simulation


To run one MCTS simulation:

To traverse the tree, keep selecting the edges with maximum Q+U value
Q = mean value of the state over all simulations
U = upper confidence bound
Do this until a leaf node is reached (= a node which has not been visited/expanded yet)
Expand the leaf node by adding a new edge for every possible action in the state
Input the leaf node into the neural network
The output:
The probabilities
The value of the state
Initialize the new edge's variables with these values:
N = 0
W = 0
Q = 0
P = p_a (prior probability for that action)
Add nodes (new states) for each action to the tree
Backpropagation
From the leaf node, backpropagate to the root node
For every edge in the path, update the edge's variables
N = N + 1
W = W + v, v is the value of the leaf node predicted by the NN in step 2.
Q = W / N
After these simulations, the move can be chosen:
The move with greatest 
 (deterministically)
According to a distribution (stochastically): 
Choose move from tree

Creating a training set
To train the network, you need a lot of data
You create this data through self-play: letting the AI play against a copy of itself for many games.
For every move, store:
The state
The search probabilities
The winner, (added once the game is over)
Training the network
Sample a mini-batch from a high amount of positions (see training set)
Train the network on the mini-batch