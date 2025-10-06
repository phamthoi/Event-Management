import * as React from "react";
import { Layout } from "react-admin";
import CustomAppBar from "./CustomAppBar";
import CustomMenu from "./CustomMenu";

const CustomLayout = (props: any) => (
  <Layout {...props} appBar={CustomAppBar} menu={CustomMenu} />
);

export default CustomLayout;
