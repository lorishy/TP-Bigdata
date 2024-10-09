from pyspark.sql import SparkSession

# Creation de la session Spark
spark = SparkSession.builder \
	.appName("Read from HDFS") \
	.getOrCreate()

# Lecture du fichier csv
df = spark.read.text("hdfs://namenode:9000/Datasets/chat_messages.csv")

# Afficher les resultats
df.show()

# Fermeture de la session Spark
spark.stop()
