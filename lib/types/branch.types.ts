export type Branch = {
  _id: string;
  name: string;
  isParent?: boolean; // эцэг салбар эсэх
  parent?: string; // эцэг салбар
  path: string;
  createdAt: string;
};

export type BranchInput = {
  name: string;
  parentId?: string; // эцэг салбар
};
