from pyspark.sql import SparkSession

# Creation de la session Spark
spark = SparkSession.builder \
	.appName("Read from HDFS") \
	.getOrCreate()

# Lecture du fichier csv
df = spark.read.text("hdfs://namenode:9000/Datasets/train.csv")

#************************* Exercice 2 et Exercice 3 ****************
 
#1/ voir les premiers lignes de donnees
df.show(5)
 
#2/voir les les types de colonnes
print(df.printSchema())
 
#3/voir le nombre de lignes
nombre_lignes = str(df.count())
# Afficher le resultat
print("Nombre de lignes :" + nombre_lignes)
 
#4/ compter les valeurs manquantes
for col in df.columns:
    missing_count = df.filter(df[col].isNull()).count()
    print('Nombre de valeurs manquantes dans la colonne {} : {}'.format(col,missing_count))
 
#5/compter les duplicas dans le dataFrame
nb_duplicas = df.groupBy(df.columns).count().filter("count > 1").count()
print("nombre de ligne : {}".format(nb_duplicas))

# Fermeture de la session Spark
spark.stop()
