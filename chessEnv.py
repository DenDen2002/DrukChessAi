import config
from re import A
import chess
from chess import Move
import numpy as np

import time
import logging

logging.basicConfig(level=logging.INFO, format=' %(message)s')


class ChessEnv:
    def __init__(self, fen: str = chess.STARTING_FEN):
        """
        Initialize the chess environment
        """
        # the chessboard
        self.fen = fen
        self.reset()

    def reset(self):
        """
        Reset everything
        """
        self.board = chess.Board(self.fen)

    @staticmethod
    def state_to_input(fen: str) -> np.ndarray(config.INPUT_SHAPE):
        """
        Convert board to a state that is interpretable by the model
        """

        board = chess.Board(fen)

        # 1. is it white's turn? (1x8x8)
        is_white_turn = np.ones((8, 8)) if board.turn else np.zeros((8, 8))

        # 2. castling rights (4x8x8)
        castling = np.asarray([
            np.ones((8, 8)) if board.has_queenside_castling_rights(
                chess.WHITE) else np.zeros((8, 8)),
            np.ones((8, 8)) if board.has_kingside_castling_rights(
                chess.WHITE) else np.zeros((8, 8)),
            np.ones((8, 8)) if board.has_queenside_castling_rights(
                chess.BLACK) else np.zeros((8, 8)),
            np.ones((8, 8)) if board.has_kingside_castling_rights(
                chess.BLACK) else np.zeros((8, 8)),
        ])

        # 3. repitition counter
        counter = np.ones(
            (8, 8)) if board.can_claim_fifty_moves() else np.zeros((8, 8))

        # create new np array
        arrays = []
        for color in chess.COLORS:
            # 4. player 1's pieces (6x8x8)
            # 5. player 2's pieces (6x8x8)
            for piece_type in chess.PIECE_TYPES:
                # 6 arrays of 8x8 booleans
                array = np.zeros((8, 8))
                for index in list(board.pieces(piece_type, color)):
                    # row calculation: 7 - index/8 because we want to count from bottom left, not top left
                    array[7 - int(index/8)][index % 8] = True
                arrays.append(array)
        arrays = np.asarray(arrays)

        # 6. en passant square (8x8)
        en_passant = np.zeros((8, 8))
        if board.has_legal_en_passant():
            en_passant[7 - int(board.ep_square/8)][board.ep_square % 8] = True

        r = np.array([is_white_turn, *castling,
                     counter, *arrays, en_passant]).reshape((1, *config.INPUT_SHAPE))
        # memory management
        del board
        return r.astype(bool)

    @staticmethod
    def input_to_state(input_state: np.ndarray) -> str:
        """
        Convert tensor representation back to FEN notation
        """
        # Extract the components from the input state
        is_white_turn = input_state[:, :, 0]
        castling = input_state[:, :, 1:5]
        counter = input_state[:, :, 5]
        piece_arrays = input_state[:, :, 6:132]
        en_passant = input_state[:, :, 132]
        # Create an empty chess board
        board = chess.Board()

        # Set the player's turn
        board.turn = bool(is_white_turn[0, 0])

        # Set the castling rights
        for i in range(2):
            if np.any(castling[i]):
                board.set_castling_fen(
                    chess.WHITE if i == 0 else chess.BLACK, 'KQ')
        for i in range(2, 4):
            if np.any(castling[i]):
                board.set_castling_fen(
                    chess.WHITE if i == 2 else chess.BLACK, 'kq')

        # Set the repetition counter
        board.halfmove_clock = 50 if np.any(counter) else 0

        # Set the piece positions
        for color in chess.COLORS:
            for piece_type in chess.PIECE_TYPES:
                piece_indices = np.argwhere(
                    piece_arrays[(6 * color) + piece_type])
                for index in piece_indices:
                    row = 7 - index[0]
                    col = index[1]
                    square = chess.square(col, row)
                    piece = chess.Piece(piece_type, color)
                    board.set_piece_at(square, piece)

        # Set the en passant square
        en_passant_indices = np.argwhere(en_passant)
        if len(en_passant_indices) > 0:
            row = 7 - en_passant_indices[0][0]
            col = en_passant_indices[0][1]
            square = chess.square(col, row)
            board.ep_square = square

        return board.fen()

    @staticmethod
    def estimate_winner(board: chess.Board) -> int:
        """
        Estimate the winner of the current node.
        Pawn = 1, Bishop = 3, Rook = 5, Queen = 9
        Positive score = white wins, negative score = black wins
        """
        score = 0
        piece_scores = {
            chess.PAWN: 1,
            chess.KNIGHT: 3,
            chess.BISHOP: 3,
            chess.ROOK: 5,
            chess.QUEEN: 9,
            chess.KING: 0
        }
        for piece in board.piece_map().values():
            if piece.color == chess.WHITE:
                score += piece_scores[piece.piece_type]
            else:
                score -= piece_scores[piece.piece_type]
        if np.abs(score) > 5:
            if score > 0:
                logging.debug("White wins (estimated)")
                return 0.25
            else:
                logging.debug("Black wins (estimated)")
                return -0.25
        else:
            logging.debug("Draw")
            return 0

    @staticmethod
    def get_piece_amount(board: chess.Board) -> int:
        return len(board.piece_map().values())

    def __str__(self):
        """
        Print the board
        """
        return str(chess.Board(self.board))

    def step(self, action: Move) -> chess.Board:
        """
        Perform a step in the game
        """
        self.board.push(action)
        return self.board
