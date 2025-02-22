import React from "react";
import { View, Text, Linking, TouchableOpacity, ScrollView } from "react-native";
import styles from "../../styles";

export default function Attributions({ navigation }) {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const LinkComp = (props) => {
    return (<TouchableOpacity onPress={() => handleLinkPress(props.url)}>
    <Text style={styles.links} >
      {props.label}
    </Text>
  </TouchableOpacity>)
  };



  return (
    <ScrollView>
      <View style={styles.attributions}>
        <Text>The members of the development team include:</Text>

        <Text>• Alex Chen (<LinkComp url="https://www.linkedin.com/in/yan-yu-chen-3474a71aa/" label="in/yan-yu-chen-3474a71aa"/>) of the Blue Shield</Text>
        <Text>• Nicholas Davila (<LinkComp url="https://www.linkedin.com/in/nicholas--davila/" label="in/nicholas--davila"/>) of the Blue Shield</Text>
        <Text>• Noor Ul Huda (<LinkComp url="https://www.linkedin.com/in/noorulhuda92/" label="in/noorulhuda92"/>) of the Blue CoLab</Text> 
        <Text>• Lizi Imedashvilli (<LinkComp url="https://www.linkedin.com/in/lizi-imedashvili-2b3a6b249" label="in/lizi-imedashvili-2b3a6b249"/>) of the Data Divas</Text> 
        <Text>• Ardin Kraja (<LinkComp url="https://www.linkedin.com/in/ardin-kraja-19ab61230" label="in/ardin-kraja-19ab61230"/>) of Blue Jelly</Text>
        <Text>• Victor Lima (<LinkComp url="https://www.linkedin.com/in/victor--lima" label="in/victor--lima"/>) of the Data Divas</Text>
        <Text>• Meryl Mizell (<LinkComp url="https://www.linkedin.com/in/meryl-mizell" label="in/meryl-mizell"/>) of Blue Jelly</Text>
        <Text>• Charles Metayer (<LinkComp url="https://www.linkedin.com/in/charles-metayer-jr-9a983b267/" label="in/charles-metayer-jr-9a983b267"/>) of the Blue Shield</Text>
        <Text>• Lulu Moquette (<LinkComp url="https://www.linkedin.com/in/louisamoquete" label="in/louisamoquete"/>) of Blue Jelly</Text>
        <Text>• Kenji Okura (<LinkComp url="https://www.linkedin.com/in/kenji-okura" label="in/kenji-okura"/>) of Blue Jelly</Text>
        <Text>• Michael Rourke (<LinkComp url="https://www.linkedin.com/in/michael-rourke-532b32225/" label="in/michael-rourke-532b32225"/>) of the Blue Shield</Text>
        <Text>• Erin Sorbella (<LinkComp url="https://www.linkedin.com/in/erin-sorbella-40936b241" label="in/erin-sorbella-40936b241"/>) of Blue Jelly</Text>

        <Text>We would like to give the following attributions:</Text>

        <Text>
          • The calculations to convert dissolved oxygen units are adapted from the
          U of MN Natural Resources Research Institute, see{" "}
          <TouchableOpacity onPress={() => handleLinkPress("https://www.waterontheweb.org/under/waterquality/dosatcalc.html")}>
            <Text style={styles.links} >
              waterontheweb
            </Text>
          </TouchableOpacity>.
        </Text>

        <Text>
          • The calculations to calculate WQI are adapted from George Moses & Ali
          Tejeda, see{" "}
          <TouchableOpacity onPress={() => handleLinkPress("https://colab.research.google.com/drive/17uZffhhG-OtwZyPsU5QVXbhWqQcfp7jv#scrollTo=QJ7FQ4m8BnA8")}>
            <Text style={styles.links} >
              Python
            </Text>
          </TouchableOpacity>.
        </Text>

        <Text>
          • Pace University water data is courtesy of Blue CoLab. Join the team:{" "}
          <TouchableOpacity onPress={() => handleLinkPress("https://bluecolab.pace.edu/")}>
            <Text style={styles.links}>
              https://bluecolab.pace.edu/
            </Text>
          </TouchableOpacity>.
        </Text>

        <Text>
          • Yonkers, Poughkeepsie, and West Point water data is courtesy of the
          USGS. Discover more here:{" "}
          <TouchableOpacity onPress={() => handleLinkPress("https://waterdata.usgs.gov/nwis")}>
            <Text style={styles.links}>
              Water Data
            </Text>
          </TouchableOpacity>.
        </Text>

        <Text>
          • Shiny CSS Spinner was adapted from Dean Attali. Code taken from here: {" "}
          <TouchableOpacity onPress={() => handleLinkPress("https://github.com/daattali/shinycssloaders/blob/master/inst/assets/spinner.css")}>
            <Text style={styles.links}>
              GitHub
            </Text>
          </TouchableOpacity>.
        </Text>

        <Text>
          • Lastly we would like to thank our friends and fellow classmates in our Software Engineering Class for their support and feedback. A shotout to Prolog 2.0, TLX, PowerPuff, and SCRUMptious. We also appreciate feedback by various persons not listed here in improving our UI/UX design.
        </Text>
      </View>
    </ScrollView>
  );
}
