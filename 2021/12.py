import pprint
import re


class CaveConnection:
    def __init__(self, start, end):
        self.start = start
        self.end = end

    def __str__(self):
        return f"{self.start}-{self.end}"

    def __repr__(self):
        return self.__str__()


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            result = re.search(
                "(.+)-(.+)\\n",
                line)
            data.append(CaveConnection(result.group(1), result.group(2)))

    return data


def part_one(file_name):
    connection_list = extract_data(file_name)
    cave_graph = build_cave_graph_from(connection_list)
    pprint.pprint(cave_graph)

    visited_list = [[]]
    depth_first(cave_graph, "start", [], visited_list)

    print('Nodes visited in this order:')
    start_to_end_paths = list(
        filter(lambda x: x[0] == "start" and x[-1] == "end", filter(lambda x: len(x) > 1, visited_list)))
    pprint.pprint(start_to_end_paths)
    print(f"number of paths {len(start_to_end_paths)}")


def build_cave_graph_from(connection_list):
    cave_graph = {}
    for connection in connection_list:
        if connection.start not in cave_graph.keys():
            cave_graph[connection.start] = []
        if connection.end not in cave_graph.keys():
            cave_graph[connection.end] = []
        cave_graph[connection.start].append(connection.end)
        cave_graph[connection.end].append(connection.start)
    return cave_graph


def depth_first(graph, current_vertex, visited, visited_list):
    visited.append(current_vertex)
    for vertex in graph[current_vertex]:
        if vertex.isupper() or vertex.islower() and vertex not in visited:
            depth_first(graph, vertex, visited.copy(), visited_list)
    visited_list.append(visited)


def adjusted_depth_first(graph, current_vertex, visited, visited_list):
    visited.append(current_vertex)
    for vertex in graph[current_vertex]:
        if vertex.isupper() or vertex.islower() and not visited.count(vertex) >= 2 and has_only_one_lower_cave_twice(visited):
            adjusted_depth_first(graph, vertex, visited.copy(), visited_list)
    visited_list.append(visited)
    print(f"path count {len(visited_list)}")


def has_only_one_lower_cave_twice(path):
    lower_cave_occurs_twice = 0
    more_than_twice_counter = 0
    lower_caves_in_path = list(filter(lambda x: x.islower(), path))
    caves_without_duplicates = list(dict.fromkeys(lower_caves_in_path))
    for cave in caves_without_duplicates:
        if lower_caves_in_path.count(cave) == 2:
            lower_cave_occurs_twice += 1
        elif lower_caves_in_path.count(cave) > 2:
            more_than_twice_counter += 1
    if more_than_twice_counter > 0 or lower_cave_occurs_twice > 1:
        return False
    else:
        return True


def part_two(file_name):
    connection_list = extract_data(file_name)
    cave_graph = build_cave_graph_from(connection_list)

    visited_list = []
    adjusted_depth_first(cave_graph, "start", [], visited_list)

    print(f"number of paths {len(visited_list)}")
    start_and_end_only_occur_once_list = list(
        filter(lambda x: x.count("start") == 1 and x.count("end") == 1, visited_list))
    print(f"number of paths with only one start and one end {len(start_and_end_only_occur_once_list)}")
    start_to_end_list = list(
        filter(lambda x: x[0] == "start" and x[-1] == "end",
               filter(lambda x: len(x) > 1, start_and_end_only_occur_once_list)))
    print(f"number of start as first and end as last paths {len(start_to_end_list)}")
    little_caves_only_appear_twice_for_one_time_list = list(filter(has_only_one_lower_cave_twice, start_to_end_list))
    print(f"number of caves where only one lower cave appears twice {len(little_caves_only_appear_twice_for_one_time_list)}")


if __name__ == "__main__":
    part_two("12_input.txt")
