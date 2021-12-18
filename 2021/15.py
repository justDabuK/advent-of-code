import pprint
from collections import deque


class Graph:
    def __init__(self, adjac_lis):
        self.adjac_lis = adjac_lis

    def get_neighbors(self, v):
        return self.adjac_lis[v]

    # This is heuristic function which is having equal values for all nodes
    def h(self, n):
        return 1

    def a_star_algorithm(self, start, stop):
        # In this open_lst is a lisy of nodes which have been visited, but who's
        # neighbours haven't all been always inspected, It starts off with the start
        # node
        # And closed_lst is a list of nodes which have been visited
        # and who's neighbors have been always inspected
        open_lst = set([start])
        closed_lst = set([])

        # poo has present distances from start to all other nodes
        # the default value is +infinity
        poo = {}
        poo[start] = 0

        # par contains an adjac mapping of all nodes
        par = {}
        par[start] = start

        while len(open_lst) > 0:
            n = None

            # it will find a node with the lowest value of f() -
            for v in open_lst:
                if n == None or poo[v] + self.h(v) < poo[n] + self.h(n):
                    n = v;

            if n == None:
                print('Path does not exist!')
                return None

            # if the current node is the stop
            # then we start again from start
            if n == stop:
                reconst_path = []

                while par[n] != n:
                    reconst_path.append(n)
                    n = par[n]

                reconst_path.append(start)

                reconst_path.reverse()

                print('Path found: {}'.format(reconst_path))
                return reconst_path

            # for all the neighbors of the current node do
            for (m, weight) in self.get_neighbors(n):
                # if the current node is not presentin both open_lst and closed_lst
                # add it to open_lst and note n as it's par
                if m not in open_lst and m not in closed_lst:
                    open_lst.add(m)
                    par[m] = n
                    poo[m] = poo[n] + weight

                # otherwise, check if it's quicker to first visit n, then m
                # and if it is, update par data and poo data
                # and if the node was in the closed_lst, move it to open_lst
                else:
                    if poo[m] > poo[n] + weight:
                        poo[m] = poo[n] + weight
                        par[m] = n

                        if m in closed_lst:
                            closed_lst.remove(m)
                            open_lst.add(m)

            # remove n from the open_lst, and add it to closed_lst
            # because all of his neighbors were inspected
            open_lst.remove(n)
            closed_lst.add(n)

        print('Path does not exist!')
        return None


def extract_data(file_name):
    risk_level_matrix = []

    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            risk_level_matrix.append(list(map(int, (line.rstrip()))))

    return risk_level_matrix


def part_one(file_name):
    risk_level_matrix = extract_data(file_name)

    find_shortest_path(risk_level_matrix)


def find_shortest_path(risk_level_matrix):
    weighted_graph_dict = get_weighted_graph_dictionary(risk_level_matrix)
    starting_node = list(weighted_graph_dict.keys())[0]
    end_node = list(weighted_graph_dict.keys())[-1]
    print(f"start is {starting_node}, end is {end_node}")
    graph1 = Graph(weighted_graph_dict)
    shortest_path = graph1.a_star_algorithm(starting_node, end_node)
    # need to initialize score with minus the start risk value, since it does not count in
    score = 0
    value = get_risk_value_for_node(risk_level_matrix, starting_node)
    score -= value
    for node in shortest_path:
        score += get_risk_value_for_node(risk_level_matrix, node)
    print(f"score of shortest path is {score}")


def get_weighted_graph_dictionary(risk_level_matrix):
    weighted_graph = {}
    number_of_rows = len(risk_level_matrix)
    for row_index in range(number_of_rows):
        number_of_cols = len(risk_level_matrix[row_index])
        for col_index in range(number_of_cols):
            weighted_graph[f"{row_index},{col_index}"] = []

            neighbours_of_current_node_list = weighted_graph[f"{row_index},{col_index}"]

            if row_index > 0:
                above_row_index = row_index - 1
                above_col_index = col_index
                neighbours_of_current_node_list.append(
                    (f"{above_row_index},{above_col_index}", risk_level_matrix[above_row_index][above_col_index]))

            if col_index > 0:
                left_row_index = row_index
                left_col_index = col_index - 1
                neighbours_of_current_node_list.append(
                    (f"{left_row_index},{left_col_index}", risk_level_matrix[left_row_index][left_col_index]))

            if col_index < number_of_cols - 1:
                right_row_index = row_index
                right_col_index = col_index + 1
                neighbours_of_current_node_list.append(
                    (f"{right_row_index},{right_col_index}", risk_level_matrix[right_row_index][right_col_index]))

            if row_index < number_of_rows - 1:
                below_row_index = row_index + 1
                below_col_index = col_index
                neighbours_of_current_node_list.append(
                    (f"{below_row_index},{below_col_index}", risk_level_matrix[below_row_index][below_col_index]))
    return weighted_graph


def get_risk_value_for_node(risk_level_matrix, node):
    row_index, col_index = node.split(",")
    risk_value = risk_level_matrix[int(row_index)][int(col_index)]
    return risk_value


def part_two(file_name):
    risk_level_matrix = extract_data(file_name)
    pprint.pprint(risk_level_matrix)

    # multiply columns
    enlarged_risk_level_matrix = []
    number_of_multiplications = 5
    for row_multiplication_count in range(number_of_multiplications):
        for row in risk_level_matrix:
            current_row = []
            for column_multiplication_count in range(number_of_multiplications):
                for entry in row:
                    new_value = entry + column_multiplication_count + row_multiplication_count
                    while new_value > 9:
                        new_value -= 9
                    current_row.append(new_value)
            enlarged_risk_level_matrix.append(current_row)

    #check_if_values_are_correct_for(enlarged_risk_level_matrix)
    find_shortest_path(enlarged_risk_level_matrix)


def check_if_values_are_correct_for(enlarged_risk_level_matrix):
    control_enlarged_risk_level_matrix = extract_data("15_part_two_newly_calculated_input.txt")
    for row_index in range(len(enlarged_risk_level_matrix)):
        actual_row = enlarged_risk_level_matrix[row_index]
        expected_row = control_enlarged_risk_level_matrix[row_index]
        if len(actual_row) != len(expected_row):
            print(f"ERROR: they don't have the same lenght")
        for col_index in range(len(actual_row)):
            actual_value = actual_row[col_index]
            expected_value = expected_row[col_index]
            if actual_value != expected_value:
                print(f"ERROR: {actual_value} is not {expected_value} at {row_index},{col_index}")


if __name__ == "__main__":
    part_two("15_input.txt")
