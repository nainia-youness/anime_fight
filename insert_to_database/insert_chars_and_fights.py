import pandas as pd

#read data from file
print("read from file")
df=pd.read_csv("char_data.csv",encoding='utf8')
#print(df.head())


print("add data to list")
char_list=[]

i=0
for index, rows in df.iterrows():
    my_list =(i,rows.names, rows.info, rows.imgs)
    i+=1
    char_list.append(my_list)


def create_fights(list_of_char_indexes):
    def is_in_list(fight_list,char1,char2):
        for fight in fight_list:
            if(fight[1:3]==(char1,char2) or fight[1:3]==(char2,char1)):
                return True
        return False


    fight_list=[]
    j=0
    for char1 in list_of_char_indexes:
        for char2 in list_of_char_indexes:
            if(char1!=char2):
                if(not is_in_list(fight_list,char1,char2)):
                    fight_list.append((j,char1,char2))
                    j+=1

    return fight_list
 

import mysql.connector

print("connecting to database")

try:    
    mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="anime_fight_db"
    )
    print("connection succeded")
except mysql.connector.Error as err:
    raise err
    

mycursor = mydb.cursor()

print("insert to animechar")
#ALTER TABLE animechar CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
sql = "INSERT INTO animechar (id_char,name,info,img) VALUES (%s, %s,%s, %s)"

mycursor.executemany(sql, char_list)

mydb.commit()

print(mycursor.rowcount, "anime characters were inserted succesfully.")

print("insert to fights")

list_of_char_indexes=[]
for i in range(len(char_list)):
    list_of_char_indexes.append(i)

fights=create_fights(list_of_char_indexes)

sql = "INSERT INTO fight (id_fight,id_char1,id_char2) VALUES (%s, %s,%s)"


mycursor.executemany(sql, fights)

mydb.commit()

print(mycursor.rowcount, "fights were inserted succesfully.")