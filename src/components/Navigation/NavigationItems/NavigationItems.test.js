import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import NavigationItems from "./NavigationItems";
import NavigationItem from "./NavigationItem/NavigationItem";

configure({ adapter: new Adapter() });

let wrapper;
beforeEach(() => {
  wrapper = shallow(<NavigationItems />);
});

describe("<NavigationItems />", () => {
  it("should render 2 <Navigation /> elements if not authenticated", () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(2); //Find it twice
  });
  it("should render 3 <Navigation /> elements if not authenticated", () => {
    wrapper.setProps({ isAuthenticated: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });
  it("should render 3 <Navigation /> element with logout link", () => {
    wrapper.setProps({ isAuthenticated: true });
    expect(
      wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)
    ).toEqual(true);
  });
});
