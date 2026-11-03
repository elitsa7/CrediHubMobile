import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";

export default function WelcomeCard() {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/welcome-finance.png")}
        style={styles.illustration}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>CREDIHUB</Text>
        </View>

        <Text style={styles.title}>Твоите цели.{"\n"}Нашата подкрепа.</Text>
        <Text style={styles.description}>
          Управлявай финансите си по-лесно. Направи следващата крачка към
          плановете си.
        </Text>
      </View>

      <View style={styles.actionField}>
        <View style={styles.calculatorIcon}>
          <Ionicons name="calculator" size={30} color="#17366F" />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>Кредитен калкулатор</Text>
          <Text style={styles.actionSubtitle}>
            Пресметни месечната си вноска
          </Text>
        </View>
        <View style={styles.arrowButton}>
          <Ionicons
            name="arrow-forward-outline"
            size={width < 380 ? 25 : 30}
            color="#BBD2FF"
          />
        </View>
      </View>
    </View>
  );
}
const createStyles = (width) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#10285C",
      borderRadius: 26,
      padding: width < 380 ? 18 : 24,
      marginTop: 20,
      minHeight: width < 380 ? 310 : 330,
      justifyContent: "space-between",
      overflow: "hidden",
    },
    content: {
      flex: 1,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    brand: {
      fontSize: 12,
      fontWeight: "800",
      color: "#BBD2FF",
      letterSpacing: 2,
    },
    title: {
      fontSize: width < 380 ? 21 : 24,
      fontWeight: "800",
      color: "#FFFFFF",
      lineHeight: width < 380 ? 28 : 32,
      marginTop: 15,
      maxWidth: "85%",
    },
    description: {
      fontSize: width < 380 ? 13 : 15,
      color: "#C6D7F5",
      lineHeight: width < 380 ? 18 : 20,
      marginTop: 15,
      maxWidth: "72%",
    },
    actionField: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#DCE8FF",
      borderRadius: 18,
      padding: 8,
      marginTop: 20,
    },
    calculatorIcon: {
      width: width < 380 ? 44 : 50,
      height: width < 380 ? 44 : 50,
      borderRadius: width < 380 ? 15 : 20,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
    actionContent: {
      flex: 1,
      justifyContent: "center",
      marginLeft: 6,
    },
    actionTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#17366F",
      textAlign: "center",
    },
    actionSubtitle: {
      fontSize: 11,
      color: "#45669F",
      marginTop: 5,
      textAlign: "center",
    },
    arrowButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: "#17366F",
      justifyContent: "center",
      alignItems: "center",
    },
    illustration: {
      position: "absolute",
      width: width < 380 ? 180 : 220,
      height: width < 380 ? 155 : 190,
      right: width < 380 ? -10 : -15,
      bottom: 75,
      opacity: 0.95,
    },
  });
