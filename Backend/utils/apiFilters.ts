import { Query } from "mongoose";


class APIFilters {
    query: Query<any[], any>;
    queryStr: Record<string, string>;

    constructor (query: Query<any[], any>, queryStr: Record<string, string>) {
        this.query = query;
        this.queryStr = queryStr;
    }


    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    };
};


export default APIFilters;