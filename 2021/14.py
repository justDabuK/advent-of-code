import pprint
import re


class InsertionRule:
    def __init__(self, origin_pair, element_to_insert):
        self.origin_pair = origin_pair
        self.element_to_insert = element_to_insert
        self.apply_counter = 0

    def __str__(self):
        return f"{self.origin_pair} -> {self.element_to_insert}, applied for {self.apply_counter} times"

    def __repr__(self):
        return self.__str__()

    def applied(self):
        self.apply_counter += 1


class Insertion:
    def __init__(self, character, index):
        self.character = character
        self.index = index

    def __str__(self):
        return f"{self.character} at {self.index}"

    def __repr__(self):
        return self.__str__()

    def __lt__(self, other):
        return self.index < other.index


class CharacterOccurrences:
    def __init__(self, character, occurrences):
        self.character = character
        self.occurrences = occurrences

    def __str__(self):
        return f"{self.character} for {self.occurrences} times"

    def __repr__(self):
        return self.__str__()

    def __lt__(self, other):
        return self.occurrences < other.occurrences


def extract_data(file_name):
    polymer_template = None
    insertion_rules = []

    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            if "->" in line:
                result = re.search("(.{2}) -> (.)", line)
                insertion_rules.append(InsertionRule(result.group(1), result.group(2)))
            elif line.rstrip():
                polymer_template = line.rstrip()

    return polymer_template, insertion_rules


def extract_data_two(file_name):
    polymer_template = None
    insertion_rules = {}

    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            if "->" in line:
                result = re.search("(.{2}) -> (.)", line)
                insertion_rules[result.group(1)] = result.group(2)
            elif line.rstrip():
                polymer_template = line.rstrip()

    return polymer_template, insertion_rules


def find_occurrences(string, substring):
    return [m.start() for m in re.finditer(f"(?={substring})", string)]


def part_one(file_name):
    polymer_template, insertion_rules = extract_data(file_name)

    # now check which rules apply to the current template
    # print(polymer_template)

    for i in range(10):
        polymer_template = apply_insertion_rules(insertion_rules, polymer_template)
        pprint.pprint(insertion_rules)
        pprint.pprint(get_character_occurrences(polymer_template))

    character_occurrences = get_character_occurrences(polymer_template)

    pprint.pprint(character_occurrences)
    character_occurrences.sort()
    print(f"least often character is {character_occurrences[0]}")
    print(f"most often character is {character_occurrences[-1]}")
    print(f"score is {character_occurrences[-1].occurrences - character_occurrences[0].occurrences}")


def get_character_occurrences(polymer_template):
    possible_character_list = set(polymer_template)
    character_occurrences = []
    for char in possible_character_list:
        character_occurrences.append(CharacterOccurrences(char, polymer_template.count(char)))
    return character_occurrences


def apply_insertion_rules(insertion_rules, polymer_template):
    insert_list = []
    for rule in insertion_rules:
        if rule.origin_pair in polymer_template:
            occurrences = find_occurrences(polymer_template, rule.origin_pair)
            for index in occurrences:
                rule.applied()
                insert_list.append(Insertion(rule.element_to_insert, index + 1))
    insert_list.sort()
    for list_index in range(len(insert_list) - 1, -1, -1):
        insertion = insert_list[list_index]
        polymer_template = polymer_template[:insertion.index] + insertion.character + polymer_template[insertion.index:]
    return polymer_template


def part_two(file_name):
    polymer_template, insertion_rules = extract_data_two(file_name)

    character_count_dictionary = {}

    for character in polymer_template:
        increment_count_for_character(character_count_dictionary, character)

    pprint.pprint(character_count_dictionary)
    # now check which rules apply to the current template
    print(polymer_template)
    pprint.pprint(insertion_rules)

    # first get initially applied rules
    previous_rules_to_apply = []
    for origin_pair in insertion_rules:
        if origin_pair in polymer_template:
            occurrences = find_occurrences(polymer_template, origin_pair)
            for index in occurrences:
                previous_rules_to_apply.append(origin_pair)
    print(previous_rules_to_apply)

    rule_count = []
    for rule in insertion_rules.keys():
        rule_count.append(0)
    rule_origin_list = list(insertion_rules.keys())
    prev_rules_to_apply = []
    for rule in rule_origin_list:
        prev_rules_to_apply.append(0)
    for origin_pair in previous_rules_to_apply:
        prev_rules_to_apply[rule_origin_list.index(origin_pair)] += 1
    print(prev_rules_to_apply)
    for index in range(len(prev_rules_to_apply)):
        rule_count[index] += prev_rules_to_apply[index]

    # iteration 1
    for i in range(40 - 1):
        new_rules_to_apply = []
        for rule in rule_origin_list:
            new_rules_to_apply.append(0)
        for index in range(len(prev_rules_to_apply)):
            apply_counter = prev_rules_to_apply[index]
            origin_pair = rule_origin_list[index]
            resulting_character = insertion_rules[origin_pair]

            first_new_pair = origin_pair[0] + resulting_character
            first_new_pair_index = rule_origin_list.index(first_new_pair)
            second_new_pair = resulting_character + origin_pair[1]
            second_new_pair_index = rule_origin_list.index(second_new_pair)

            new_rules_to_apply[first_new_pair_index] += apply_counter
            new_rules_to_apply[second_new_pair_index] += apply_counter
        prev_rules_to_apply = new_rules_to_apply
        for index in range(len(prev_rules_to_apply)):
            rule_count[index] += prev_rules_to_apply[index]

    print(rule_count)
    print(prev_rules_to_apply)

    for origin_pair in insertion_rules.keys():
        index = rule_origin_list.index(origin_pair)
        increment_value = rule_count[index]
        increment_count_for_character(character_count_dictionary, insertion_rules[origin_pair], increment_value)

    pprint.pprint(character_count_dictionary)

    min_character = min(character_count_dictionary, key=character_count_dictionary.get)
    max_character = max(character_count_dictionary, key=character_count_dictionary.get)

    print(f"min character is {min_character} with {character_count_dictionary[min_character]} counts")
    print(f"min character is {max_character} with {character_count_dictionary[max_character]} counts")
    print(f"score is {character_count_dictionary[max_character] - character_count_dictionary[min_character]}")


def increment_count_for_character(character_count_dictionary, character, value=1):
    if character not in character_count_dictionary.keys():
        character_count_dictionary[character] = 0
    character_count_dictionary[character] += value


if __name__ == "__main__":
    part_two("14_input.txt")
