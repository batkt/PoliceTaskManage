export type Branch = {
  _id: string;
  name: string;
  isParent?: boolean; // эцэг салбар эсэх
  parent?: Branch; // эцэг салбар
};
