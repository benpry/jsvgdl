import psycopg2
import json
import csv
import sys
import os
from os import path
from collections import defaultdict

CSV = 'csv'
SERIES = 'series'

class DB():
	def __init__(self):
		config = {'dbname'  : 'd9ahikn1rs4equ',
					'user'    : 'smcgqgjzpgenik',
					'host'    : 'ec2-54-235-85-65.compute-1.amazonaws.com',
					'password': 'mlKsdNWIVGgGEbO9-VwQ1S74c_',
					'sslmode': 'require'}

		cstring = ''
		for c in config:
			cstring +="%s='%s' " % (c, config[c])

		client = psycopg2.connect(cstring)

		self.cursor = client.cursor()


		self.cursor.execute('select id, data from experiments')
		self.experiments = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: ''))))
		for row in self.cursor.fetchall():
			game_data = json.loads(row[1])
			self.experiments[row[0]][game_data['name']][int(game_data['level'])][int(game_data['round'])] = row[1]

		self.cursor.execute('select * from multigames')
		self.games = defaultdict(lambda : {'descs': [], 'levels': []})
		for row in self.cursor.fetchall():
			self.games[row[0]]['descs'] = row[1]
			self.games[row[0]]['levels'] = row[2]

		self.experiment_validation = defaultdict(lambda:'')
		self.valid_experiments = defaultdict(lambda:'')
		self.cursor.execute('select id, val_id from experiments')
		for row in self.cursor.fetchall():
			self.experiment_validation[row[0]] = row[1]
			self.valid_experiments[row[1]] = row[0]

		try:
			os.stat(CSV)
		except:
			os.mkdir(CSV)

		try:
			os.stat(SERIES)
		except:
			os.mkdir(SERIES)


	def get_game_names(self):
		return self.games.keys()

	def get_game_descs(self, game_name):
		return self.games[game_name]['descs']

	def get_game_levels(self, game_name):
		return self.games[game_name]['levels']

	def get_valid_exp(self, val_id):
		return self.valid_experiments[val_id]

	def get_exp_validation(self, exp_id):
		return self.experiment_validation[exp_id]

	def get_exp_data(self, exp_id, game_name, level, round):
		return self.experiments[exp_id][game_name][level][round]

	def get_exp_ids(self):
		return self.experiments.keys()

	def get_exp_games(self, exp_id):
		return self.experiments[exp_id].keys()

	def get_exp_levels(self, exp_id, game_name):
		return self.experiments[exp_id][game_name].keys()

	def get_exp_rounds(self, exp_id, game_name, level):
		return self.experiments[exp_id][game_name][level].keys()

	# Returns the list of game states for a given game
	def get_exp_series(self, exp_id, game_name, level, round):
		query = {'exp_id': exp_id,
				 'game_data': self.get_exp_data(exp_id, game_name, level, round)}
		self.cursor.execute("select states from experiments where id='{exp_id}' and data='{game_data}'".format(**query))
		return json.loads(self.cursor.fetchall()[0][0])

	def write_game_series(self, exp_id, game_name, level, round):
		filename = '%s-%s-l%ir%i.json' % (exp_id, game_name, level, round)
		with open(os.join(SERIES, filename), 'w') as outfile:
			json.dump(self.get_exp_series(exp_id, game_name, level, round), outfile)

	def read_game_series(self, file_name):
		json_data = open(file_name).read()
		return json.loads(path.join(SERIES, json_data))

	def generate_csv(self, file_name):
		print file_name
		self.cursor.execute('select id, data, time_stamp from experiments')
		rows = self.cursor.fetchall()
		experiments = []
		exp_id = ''
		game = ''
		levels_won = 0
		for row in sorted(rows, key= lambda r: (r[0], json.loads(r[2])['start_time'])):
			new_exp_id = row[0]
			
			if exp_id != new_exp_id:
				exp_id = new_exp_id
				levels_won = 0

			data = json.loads(row[1])
			new_game = data['name']
			if game != new_game:
				game = new_game
				levels_won = 0
			if data['win'] == 'true':
				levels_won += 1
			trial = {
				'subject': exp_id,
				'condition': 'no_score',
				'gameName': data['name'],
				'levels_won': levels_won,
				'steps': data['steps'],
				'score': data['score']
			}
			# print trial
			experiments.append(trial)
		# for experiment in experiments:
		with open(path.join(CSV, file_name), 'w') as csvfile:
		    fieldnames = ['subject', 'condition', 'gameName', 'levels_won', 'steps', 'score']
		    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
		    writer.writeheader()
		    for trial in experiments:
		    	writer.writerow(trial)	


if __name__ == '__main__':
	

	write_s = ['-w', 'write']
	csv_s = ['-c', 'csv']

	if len(sys.argv) == 2 and sys.argv[1] in write_s:
		db = DB()
		print '\nI\tID\t\tMTURK ID'
		i = 0
		exp_index = defaultdict(lambda: '')

		for exp_id in db.experiment_validation:
			exp_index[i] = exp_id
			print str(i)+'\t'+exp_id+'\t'+db.experiment_validation[exp_id]
			i += 1

		print '\nselect an experiment ID\n'
		selection = input('I: ')
		exp_id = exp_index[selection]

		i = 0
		print '\nI\t'
		game_index = defaultdict(lambda: '')
		for game_name in db.get_exp_games(exp_id):
			game_index[i] = game_name
			print str(i)+'\t'+game_name
			i += 1

		selection = input('I: ')
		game_name = game_index[selection]

		print '\nLevel'
		for level_num in db.get_exp_levels(exp_id, game_name):
			print level_num

		level = input('Level: ')

		print '\nRound'
		for round_num in db.get_exp_rounds(exp_id, game_name, level):
			print round_num

		round = input('Round: ')

		print '\nWill write game series to file: %s-%s-l%ir%i.json' % (exp_id, game_name, level, round)
		write_file = raw_input('Write game series to File? y/n\n:')

		agree = ['y', 'yes']
		disagree = ['n', 'no']
		if write_file.lower() in agree:
			db.write_game_series(exp_id, game_name, level, round)
		else:
			print '\nCanceling'

	if len(sys.argv) >= 2 and sys.argv[1] in csv_s:
		print 'writing csvfile'
		db = DB()
		if len(sys.argv) == 3:
			db.generate_csv(sys.argv[2])
		elif len(sys.argv) == 2:
			db.generate_csv('experiments.csv')
	else:
		print '\n-w\n\tTo select experiment to write game state to local file'
		print '\n-c | -c [filename.csv]\n\tTo write local csv of all data (defaults to experiments.csv)'


