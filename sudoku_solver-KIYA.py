import collections
from typing import List


class SudokuSolver:
    def solveSudoku(self, board: List[List[str]]) -> None:
        row_set = collections.defaultdict(list)
        col_set = collections.defaultdict(list)
        rc_set = collections.defaultdict(list)
        def is_avail(row, col, i):
            if i not in row_set[row] and i not in col_set[col] and i not in rc_set[(row//3, col//3)]:
                return True
            return False

        def dfs(row, col):
            if row == len(board):
                return True
            if col == len(board[0]):
                return dfs(row + 1, 0)

            if board[row][col] == '.':
                for i in range(1, 10):
                    if is_avail(row, col, str(i)):
                        row_set[row].append(str(i))
                        col_set[col].append(str(i))
                        rc_set[(row//3, col//3)].append(str(i))
                        board[row][col] = str(i)
                        if dfs(row, col + 1):
                            return True
                        row_set[row].pop()
                        col_set[col].pop()
                        rc_set[(row//3, col//3)].pop()
                        board[row][col] = '.'
            else:
                return dfs(row, col + 1)



        for r in range(len(board)):
            for c in range(len(board[0])):
                if board[r][c] != '.':
                    row_set[r].append(board[r][c])
                    col_set[c].append(board[r][c])
                    rc_set[(r//3, c//3)].append(board[r][c])

        dfs(0, 0)


board = [["1", "8", ".", ".", ".", ".", "4", ".", "."],
         [".", ".", ".", ".", "2", ".", ".", ".", "."],
         ["7", ".", ".", "1", ".", "9", ".", "3", "."],
         [".", ".", ".", "6", ".", ".", ".", ".", "."],
         [".", ".", "1", ".", ".", ".", ".", ".", "3"],
         ["9", ".", ".", "7", ".", "5", ".", "1", "."],
         [".", ".", ".", ".", "6", ".", ".", "5", "."],
         ["2", ".", ".", ".", "3", ".", ".", ".", "."],
         [".", "7", ".", "5", ".", "2", ".", ".", "8"]]

solver = SudokuSolver()
solver.solveSudoku(board)

for row in board:
    print(row)
