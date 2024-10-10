from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import StructType, StringType
from pyspark.ml.feature import Tokenizer
from pyspark.ml.classification import LogisticRegressionModel
from pyspark.ml.feature import CountVectorizerModel

# Créer la session Spark
spark = SparkSession.builder \
    .appName("KafkaSparkMLTest") \
    .getOrCreate()

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

# Schéma des données Kafka (extraction du champ "message" du message JSON)
schema = StructType().add("message", StringType())


# Extraire le contenu des messages Kafka (le champ "value" contient les messages)
value_df = kafka_stream.selectExpr("CAST(value AS STRING)")

# Parser les messages en JSON pour récupérer le champ "message"
parsed_df = value_df.withColumn("data", from_json(col("value"), schema)).select("data.*")

# **Étape 1: Tokenisation**
tokenizer = Tokenizer(inputCol="message", outputCol="words")
tokenized_df = tokenizer.transform(parsed_df)

# Charger le modèle CountVectorizer pré-entraîné
vectorizer_model = CountVectorizerModel.load("hdfs://namenode:9000/user/vec")

# **Étape 2: Utiliser le modèle de vectorisation pré-entraîné**
vectorized_df = vectorizer_model.transform(tokenized_df)

# Charger le modèle LogisticRegression pré-entraîné
model_path = "hdfs://namenode:9000/user/model"
model = LogisticRegressionModel.load(model_path)

# Appliquer le modèle de machine learning sur les données vectorisées
predictions = model.transform(vectorized_df)

# **Affichage ou écriture des prédictions dans la console**
# Utiliser writeStream pour traiter les résultats en continu
query = predictions.select("message", "prediction").writeStream \
    .outputMode("append") \
    .format("console") \
    .start()

# Ne pas terminer tant que le streaming n'est pas terminé
query.awaitTermination()
