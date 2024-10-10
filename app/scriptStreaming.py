from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import StructType, StringType
from pyspark.ml.classification import LogisticRegressionModel

# Créer la session Spark
spark = SparkSession.builder \
    .appName("KafkaSparkMLTest") \
    .getOrCreate()

model_path = "hdfs://namenode:9000/user/model" 
model = LogisticRegressionModel.load(model_path)

# Mute les logs inférieur au niveau Warning
spark.sparkContext.setLogLevel("WARN")

# Nom du topic Kafka et serveur Kafka
kafka_topic_name = "topic1"
kafka_bootstrap_servers = 'kafka:9092'

# Récupération des données du flux Kafka
kafka_stream = spark \
  .readStream \
  .format("kafka") \
  .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
  .option("subscribe", kafka_topic_name) \
  .option("failOnDataLoss", "false") \
  .load()

# Schéma des données Kafka (extraction du champ "comment" du message JSON)
schema = StructType().add("comment", StringType())

# Extraire le contenu des messages Kafka (le champ "value" contient les messages)
value_df = kafka_stream.selectExpr("CAST(value AS STRING)")

# Parser les messages en JSON pour récupérer le champ "comment"
parsed_df = value_df.withColumn("data", from_json(col("value"), schema)).select("data.*")

# Appliquer le modèle de machine learning sur les données des commentaires
predictions = model.transform(parsed_df)

# Afficher les prédictions dans la console
query = predictions.select("comment", "prediction").writeStream \
    .outputMode("append") \
    .format("console") \
    .start()

# Ne pas terminer le fichier tant que le streaming n'est pas fini
query.awaitTermination()