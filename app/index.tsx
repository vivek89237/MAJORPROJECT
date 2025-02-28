import { Redirect } from 'expo-router';

export default function RootScreen() {
  //console.log("root-screen");
  return (<Redirect href="/(home)/" />)
}
