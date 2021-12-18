def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            data.append(int(line))
    return data
