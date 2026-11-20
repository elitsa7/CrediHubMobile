import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ApplicationFormStep({
  profile,
  loan,
  monthlyIncome,
  setMonthlyIncome,
  workplace,
  setWorkplace,
  employmentType,
  setEmploymentType,
  loanPurpose,
  setLoanPurpose,
  onNext,
}) {
  const purposes = [
    "Ремонт на жилище",
    "Покупка на автомобил",
    "Обединяване на задължения",
    "Лични нужди",
    "Покупка на техника",
    "Друго",
  ];

  const employmentOptions = [
    "Трудов договор",
    "Самоосигуряващо се лице",
    "Граждански договор",
    "Безработен",
  ];

  const renderHeader = (icon, title) => (
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#233D8B" />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderOption = (option, selected, onSelect) => (
    <Pressable
      key={option}
      style={[styles.option, selected && styles.optionActive]}
      onPress={() => onSelect(option)}
    >
      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        size={20}
        color={selected ? "#233D8B" : "#94A3B8"}
      />
      <Text style={[styles.optionText, selected && styles.optionTextActive]}>
        {option}
      </Text>
    </Pressable>
  );

  const handleEmploymentSelect = (option) => {
    setEmploymentType(option);

    if (option === "Безработен") {
      setWorkplace("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {renderHeader("person-outline", "Лични данни")}

        <InfoRow label="Три имена" value={profile.fullName} />
        <InfoRow label="Телефон" value={profile.phone} />
        <InfoRow label="Имейл" value={profile.email} />
      </View>

      <View style={styles.card}>
        {renderHeader("wallet-outline", "Параметри на кредита")}

        <LoanRow label="Желана сума" value={`${loan.amount.toFixed(2)} €`} />
        <LoanRow label="Срок" value={`${loan.months} месеца`} />
        <LoanRow
          label="Годишна лихва"
          value={`${loan.annualRate.toFixed(2)} %`}
        />

        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Месечна вноска</Text>
          <Text style={styles.paymentValue}>
            {loan.monthlyPayment.toFixed(2)} €
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        {renderHeader("flag-outline", "Цел на кредита")}

        <View style={styles.optionsContainer}>
          {purposes.map((option) =>
            renderOption(option, loanPurpose === option, setLoanPurpose),
          )}
        </View>
      </View>

      <View style={styles.card}>
        {renderHeader("briefcase-outline", "Финансова информация")}

        <Text style={styles.label}>Месечен доход (нето)</Text>
        <TextInput
          style={styles.input}
          placeholder="Например 1500"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
        />

        {employmentType !== "Безработен" && (
          <>
            <Text style={styles.label}>Месторабота</Text>
            <TextInput
              style={styles.input}
              placeholder="Име на работодателя"
              placeholderTextColor="#94A3B8"
              value={workplace}
              onChangeText={setWorkplace}
            />
          </>
        )}

        <Text style={styles.label}>Вид заетост</Text>

        <View style={styles.optionsContainer}>
          {employmentOptions.map((option) =>
            renderOption(
              option,
              employmentType === option,
              handleEmploymentSelect,
            ),
          )}
        </View>
      </View>

      <Pressable style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextButtonText}>Продължи към преглед</Text>
        <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "—"}</Text>
    </View>
  );
}

function LoanRow({ label, value }) {
  return (
    <View style={styles.loanRow}>
      <Text style={styles.loanLabel}>{label}</Text>
      <Text style={styles.loanValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 11,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 3,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#EEF2FA",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#233D8B",
  },
  infoRow: {
    gap: 4,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F6",
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  loanRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F6",
  },
  loanLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  loanValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#233D8B",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 3,
    gap: 8,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#233D8B",
  },
  paymentValue: {
    fontSize: 19,
    fontWeight: "800",
    color: "#233D8B",
  },
  optionsContainer: {
    gap: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEF1F6",
  },
  optionActive: {
    backgroundColor: "#EEF2FA",
    borderColor: "#C7D2EA",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#64748B",
  },
  optionTextActive: {
    color: "#233D8B",
    fontWeight: "700",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 3,
    marginBottom: -4,
  },
  input: {
    backgroundColor: "#F1F4F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    color: "#334155",
  },
  nextButton: {
    backgroundColor: "#233D8B",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
    marginTop: 3,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
