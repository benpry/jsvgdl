config = {'dbname'  : 'd9ahikn1rs4equ',
			'user'    : 'smcgqgjzpgenik',
			'host'    : 'ec2-54-235-85-65.compute-1.amazonaws.com',
			'password': 'mlKsdNWIVGgGEbO9-VwQ1S74c_',
			'sslmode': 'require'}

cstring = ''
for c in config:
	cstring +="%s='%s' " % (c, config[c])

client = psycopg2.connect(cstring)

cursor = client.cursor()



cursor.execute('select * from experiments')