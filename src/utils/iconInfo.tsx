import React, { Component } from "react";

interface IconInfoProps {
    icon: any;
    text: string;
    title: string;
    className: string;
}

export class IconInfo extends Component<IconInfoProps, {}> {
    render() {
        return (
            <div className={'flex ' + this.props.className}>
                <div className={'mr-1 w-10 h-10'}>
                    <img src={this.props.icon} title={this.props.title} className={'w-auto h-full'}/>
                </div>
                <div>{this.props.text}</div>
            </div>
        );
    }
}
