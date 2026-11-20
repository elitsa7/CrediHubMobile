import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useResponsive } from "../../utils/responsive";

export default function AppHeader() {
  const { isSmallPhone, moderateScale } = useResponsive();

  const styles = createStyles({
    isSmallPhone,
    moderateScale,
  });

  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View>
          <Text style={styles.logo}>CrediHub</Text>
          <Text style={styles.subtitle}>Твоите финанси. Под твой контрол.</Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={23} color="#233D8B" />
            <View style={styles.notificationDot} />
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.7}
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person-outline" size={22} color="#233D8B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = ({ isSmallPhone, moderateScale }) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: moderateScale(20),
      paddingBottom: moderateScale(16),
    },
    logo: {
      fontSize: moderateScale(isSmallPhone ? 25 : 28),
      fontWeight: "800",
      color: "#233D8B",
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: moderateScale(isSmallPhone ? 11 : 13),
      color: "#64748B",
      marginTop: 5,
      flexShrink: 1,
    },
    brand: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      gap: 8,
    },
    profileButton: {
      width: moderateScale(46),
      height: moderateScale(46),
      borderRadius: moderateScale(23),
      backgroundColor: "#E8EEFF",
      justifyContent: "center",
      alignItems: "center",
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
    },
    notificationButton: {
      width: moderateScale(46),
      height: moderateScale(46),
      borderRadius: moderateScale(23),
      backgroundColor: "#E8EEFF",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    notificationDot: {
      position: "absolute",
      top: 9,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#EF4444",
      borderWidth: 1,
      borderColor: "#E8EEFF",
    },
  });
