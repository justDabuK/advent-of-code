import time

# See reddit post where people wanted to see it: https://www.reddit.com/r/adventofcode/comments/rgacln/2021_day_14_less_than_optimal_solution/

# I just copy/pasted this from my input, instead of dealing with the input parsing.
# poly = 'PBFNVFFPCPCPFPHKBONB'
#
# pairs = {}
# with open('input', 'r') as inp:
#     for line in inp:
#         pair = line.strip().split("->")
#         pairs[pair[0].strip()] = pair[1].strip()

## Uncomment these lines to use the test data
poly = list('NNCB')
pairs = {
       'CH':'B',
       'HH':'N',
       'CB':'H',
       'NH':'C',
       'HB':'C',
       'HC':'B',
       'HN':'C',
       'NN':'C',
       'BH':'H',
       'NC':'B',
       'NB':'B',
       'BN':'B',
       'BB':'N',
       'BC':'B',
       'CC':'N',
       'CN':'C'
       }

def generation(poly, qty):
    for i in range(qty):
        poly = live(poly)
    return poly

def live(poly):
    newpoly = []
    prev = None
    for ch in poly:
        if prev is not None:
            newpoly += [prev, pairs[prev + ch]]
        prev = ch
    newpoly.append(prev)
    return newpoly

def computeScores(poly, score={}):
    for ch in poly:
        score.setdefault(ch, 0)
        score[ch] += 1
    return score

def updateScores(lhs, rhs):
    for ch, qty in rhs.items():
        lhs.setdefault(ch, 0)
        lhs[ch] += rhs[ch]
    return lhs

def printScores(score):
    minch = min(score.values())
    maxch = max(score.values())
    print(score, end=' -- ')
    print(maxch - minch)

halfgens = 20
maxgens = 40
poly = generation(poly, halfgens)
print(''.join(poly))

opts = {}

scores = {}
prev = None
total = len(poly)-1
itera = 0
starttime = time.time()
for ch in poly:
    if prev is not None:
        pair = prev + ch
        print("{} {}/{} {:0.2f}s".format(pair, itera, total, (time.time() - starttime)/max(itera, 1) * total), end='::')
        itera += 1
        if pair not in opts:
            opt = generation(pair, maxgens - halfgens)[:-1]
            opts[pair] = computeScores(opt, {})
            print("{} != {}".format(len(opt), sum(opts[pair].values())))
        scores = updateScores(scores, opts[pair])
        printScores(scores)
    prev = ch
scores[prev] += 1

printScores(scores)
