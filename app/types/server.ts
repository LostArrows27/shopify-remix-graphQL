export type AdminTagResponse = {
  data: {
    productTags: {
      nodes: string[];
      pageInfo: {
        endCursor: string;
        hasNextPage: false;
      };
    };
  };
};

export type ServerTagResponse = {
  data: {
    productTags: string[];
    pageInfo: {
      startCursor: string;
      hasNextPage: boolean;
    };
  };
  status: "success" | "error";
  message?: string;
};

export type ServerCreateResponse = Omit<ServerTagResponse, "data">;
