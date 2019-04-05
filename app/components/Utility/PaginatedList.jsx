import React from "react";
import {Pagination} from "antd";
import counterpart from "counterpart";
import {Table} from "bitshares-ui-style-guide";
import "./paginated-list.scss";

export default class PaginatedList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: props.pageSize
        };
    }

    static defaultProps = {
        rows: [],
        pageSize: 15,
        label: "utility.total_x_items",
        className: "table",
        extraRow: null,
        style: {paddingBottom: "1rem"}
    };

    onChange(page, pageSize) {
        this.setState({page, pageSize});
    }

    render() {
        const {page, pageSize} = this.state;
        const {header, rows, extraRow} = this.props;
        const total = rows.length;

        let currentRows = getRows(page, pageSize);

        function getRows(page, pageSize) {
            let r = [];
            for (
                var i = (page - 1) * pageSize;
                i < Math.min(total, page * pageSize);
                i++
            ) {
                r.push(rows[i]);
            }
            return r;
        }

        /* Paginated too far or filtered out options without changing the page */
        if (!currentRows.length && total) {
            currentRows = getRows(1, pageSize);
        }

        return (
            <div className="grid-content" style={this.props.style}>
                <Table
                    className="paginated-list"
                    dataSource={currentRows}
                    columns={Array.isArray(header) ? header : []}
                    footer={() => extraRow}
                    onChange={this.props.toggleSortOrder}
                    pagination={false}
                />
                {total > pageSize ? (
                    <Pagination
                        style={{
                            paddingTop: "1rem",
                            paddingBottom: "1rem",
                            paddingLeft: this.props.leftPadding || null
                        }}
                        total={total}
                        showTotal={total =>
                            counterpart.translate(this.props.label, {
                                count: total
                            })
                        }
                        pageSize={pageSize}
                        current={page}
                        onChange={this.onChange.bind(this)}
                    />
                ) : null}

                {this.props.children}
            </div>
        );
    }
}
