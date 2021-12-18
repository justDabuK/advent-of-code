def extract_data(file_name):
    drawn_numbers = []

    boards = []
    with open(file_name) as file:
        lines = file.readlines()

        line_counter = 0
        board_counter = 0
        for line in lines:
            if line_counter == 0:
                drawn_numbers = list(map(int, line.split(",")))

            elif line == "\n":
                boards.append([])
                board_counter += 1
            else:
                boards[board_counter - 1].append(
                    list(
                        map(lambda x: [int(x), False],
                            filter(lambda x: x != "",
                                   line.split(" ")))))

            line_counter += 1

    return drawn_numbers, boards


def is_winning_board(board):
    # any row that is finished?
    for row in board:
        if all(map(lambda x: x[1], row)):
            return True

    collumns = []
    for entry in board[0]:
        collumns.append([])
    for i in range(len(board)):
        for j in range(len(board[i])):
            collumns[j].append(board[i][j])

    for col in collumns:
        if all(map(lambda x: x[1], col)):
            return True

    return False


def part_one(file_name):
    drawn_numbers, boards = extract_data(file_name)

    winning_number = None
    unmarked_sum = 0
    for number in drawn_numbers:
        if winning_number:
            break
        # mark all numbers that are the same as true
        for board in boards:
            for row in board:
                for entry in row:
                    if entry[0] == number:
                        entry[1] = True

        # see if a board won
        for board in boards:
            if is_winning_board(board):
                winning_number = number
                unmarked_sum = get_unmarked_sum(board)

    print(f"unmarked sum {unmarked_sum}")
    print(f"winning number {winning_number}")
    print(f"solution {unmarked_sum * winning_number}")


def get_unmarked_sum(board):
    unmarked_sum = 0
    unmarked_numbers = []
    for row in board:
        for entry in row:
            if not entry[1]:
                unmarked_numbers.append(entry[0])
    for num in unmarked_numbers:
        unmarked_sum += num
    return unmarked_sum


def part_two(file_name):
    drawn_numbers, boards = extract_data(file_name)
    boards = list(map(lambda x: [x, False], boards))

    winning_number = None
    unmarked_sum = 0
    for number in drawn_numbers:
        if winning_number:
            break
        # mark all numbers that are the same as true
        for board in boards:
            for row in board[0]:
                for entry in row:
                    if entry[0] == number:
                        entry[1] = True

        # see if a board won
        for board in boards:
            if is_winning_board(board[0]):
                board[1] = True
            if board[1] and len(boards) <= 1:
                winning_number = number
                unmarked_sum = get_unmarked_sum(board[0])

        boards = list(filter(lambda x: not x[1], boards))

    print(f"unmarked sum {unmarked_sum}")
    print(f"winning number {winning_number}")
    print(f"solution {unmarked_sum * winning_number}")


if __name__ == "__main__":
    part_two("04_input.txt")
