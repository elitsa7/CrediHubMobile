import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useResponsive } from "../../../utils/responsive";

export default function WelcomeCard() {
  const { width, isSmallPhone, cardPadding, moderateScale } = useResponsive();

  const styles = createStyles({
    width,
    isSmallPhone,
    cardPadding,
    moderateScale,
  });
  const router = useRouter();

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

      <Pressable
        style={styles.actionField}
        onPress={() => router.push("/calculator")}
      >
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
            size={moderateScale(isSmallPhone ? 25 : 30)}
            color="#BBD2FF"
          />
        </View>
      </Pressable>
    </View>
  );
}
const createStyles = ({ width, isSmallPhone, cardPadding, moderateScale }) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#10285C",
      borderRadius: 26,
      padding: cardPadding,
      marginTop: 20,
      minHeight: isSmallPhone ? 310 : 330,
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
      fontSize: moderateScale(isSmallPhone ? 21 : 24),
      fontWeight: "800",
      color: "#FFFFFF",
      lineHeight: moderateScale(isSmallPhone ? 28 : 32),
      marginTop: 15,
      maxWidth: "85%",
    },
    description: {
      fontSize: moderateScale(isSmallPhone ? 13 : 15),
      color: "#C6D7F5",
      lineHeight: moderateScale(isSmallPhone ? 18 : 20),
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
      width: isSmallPhone ? 44 : 50,
      height: isSmallPhone ? 44 : 50,
      borderRadius: isSmallPhone ? 15 : 20,
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
      width: moderateScale(46),
      height: moderateScale(46),
      borderRadius: moderateScale(23),
      backgroundColor: "#17366F",
      justifyContent: "center",
      alignItems: "center",
    },
    illustration: {
      position: "absolute",
      width: isSmallPhone ? 180 : 220,
      height: isSmallPhone ? 155 : 190,
      right: isSmallPhone ? -10 : -15,
      bottom: 75,
      opacity: 0.95,
    },
  });
