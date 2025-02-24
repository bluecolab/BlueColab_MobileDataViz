import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { CustomWebView } from "@components";
import { styled } from "nativewind";


export default function StoryScreen() {
  return (
    <ScrollView className="p-5 bg-gray-100">
      {/* Title */}
      <Text style={styles.title}>
        At Seidenberg School, we believe students can make a difference today,
        before they launch their careers of tomorrow.
      </Text>

      {/* Top Image */}
      <Image
        source={require("../../assets/StoryScreen/Three-labs-copy.jpg")} style={styles.image}
      />

      {/* Content Sections */}
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Do you know if your water is safe before you drink it?</Text>
      </Text>
      <Text style={styles.paragraph}>Let us answer that for you: No. We aim to change that.</Text>

      <Text style={styles.paragraph}>
        We are a team of students, interns, graduate assistants, faculty, and
        staff who work to advance the technology, information, and warning
        systems that will bring you that information.
      </Text>

      <Text style={styles.paragraph}>
        At our technology lab overlooking the Hudson River, our Choate Pond lab
        on campus, and our data lab in the Goldstein Academic Center, Blue CoLab
        is dedicated to the proposition that you have the{" "}
        <Text style={styles.bold}>right-to-know</Text> the quality of your water
        before you drink it, swim in it, fish it, or even swamp your canoe.
      </Text>

      {/* More Sections */}
      <Text style={styles.sectionTitle}>Water Contamination Risks</Text>
      <Text style={styles.paragraph}>
        Chances are the water you use is safe, but millions have found out too
        late that is not the case. Just one sip of water contaminated with
        pathogens, such as bacteria, viruses, or parasites, can cause severe
        illness in a matter of hours. Yet, still today, a conventional lab
        requires 24 - 48 hours to report analyses of samples that may only be
        taken weekly, or less.
      </Text>

      <Text style={styles.paragraph}>
        In <Text style={styles.bold}>Milwaukee (1993)</Text>, 400,000 residents
        were made ill and 100 died due to drinking water contaminated with
        cryptosporidium. Residents in <Text style={styles.bold}>Hoosick Falls</Text> and{" "}
        <Text style={styles.bold}>Newburgh, NY</Text> were exposed to highly
        toxic PFAS and may have been for years without knowing it.
      </Text>

      <Text style={styles.paragraph}>
        Water contamination is endemic across the planet, making hundreds of
        millions of people ill, including tens of millions in the United States.
        The best defense against this threat are innovations that enable{" "}
        <Text style={styles.bold}>real-time</Text>, technological detection of
        water contaminants before they can reach our taps or recreational
        waters.
      </Text>

      <Text style={styles.sectionTitle}>Blue CoLab's Hands-On Approach</Text>
      <Text style={styles.paragraph}>
        To advance these innovations, Blue CoLab is decidedly{" "}
        <Text style={styles.bold}>“hands-on.”</Text> Our students dive into:
      </Text>
      <Text style={styles.listItem}>• Operation of real-time sensors and instruments</Text>
      <Text style={styles.listItem}>• Management, visualization, and sonification of data</Text>
      <Text style={styles.listItem}>• UX, web, GIS, and app development</Text>
      <Text style={styles.listItem}>• System cybersecurity</Text>
      <Text style={styles.paragraph}>
        They work in a <Text style={styles.bold}>team-based environment</Text>,
        using our own labs, instruments, equipment, and servers.
      </Text>

      <Text style={styles.paragraph}>
        Blue CoLab stands for everything that makes Seidenberg School a special
        place — harnessing innovation on behalf of society, and providing
        students with skill-based experiences that lead to a career meaningful
        to them, and to society.
      </Text>

      {/* Closing Statement */}
      <Text style={styles.quote}>
        "All of us at Blue CoLab look forward to seeing you on the team."
      </Text>
      <Text style={styles.author}>— John Cronin, Blue CoLab Director</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0047AB", // Blue CoLab brand color
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "#0047AB",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  quote: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  author: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  image: {
    width: "100%", 
    height: 100, 
    resizeMode: "cover", 
    borderRadius: 5, 
    marginBottom: 15, 
  },
});

