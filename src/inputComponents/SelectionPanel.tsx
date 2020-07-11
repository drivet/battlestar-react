import React, { Component, ReactNode } from "react";

interface SelectionPanelProps<T> {
    available: T[],
    rows: number;
    columns: number;
    renderFn: (item: T, index: number) => ReactNode;

    // Can be 0.  If 0, selectCb will never be called
    selectCount: number;

    // Called when the final selection is made
    doneCb: (selected: T[]) => void;

    // called when modal is dismissed
    cancelCb?: () => void;
}

interface SelectionPanelState<T> {
    selected: number[];
}

export class SelectionPanel<T> extends Component<SelectionPanelProps<T>, SelectionPanelState<T>> {
    state = {
        selected: [] as number[],
    };

    render(): ReactNode {
        return (
            <div>
                <div className={'flex'}>
                    {this.props.available.map((s, i) => this.renderItem(s, i))}
                </div>
                <div className={"flex justify-center"}>
                    {this.props.selectCount > 0 && this.props.doneCb ?
                        <button className={"btn btn-std mr-1"} onClick={() => this.handleDone()}
                                disabled={this.state.selected.length < this.props.selectCount}>
                            Done
                        </button> : null}
                    {this.props.selectCount > 1 ?
                        <button className={'btn btn-std mr-1'} onClick={() => this.handleClear()}>
                            Clear
                        </button> : null}
                    {this.props.selectCount > 0 && this.props.cancelCb ?
                        <button className={'btn btn-std mr-1'} onClick={() => this.handleCancel()}>
                            Dismiss
                        </button> : null}
                </div>
            </div>
        );
    }

    private renderItem(item: T, index: number) {
        return (
            <div className={'p-1 ' + (this.isSelected(index) ? 'bg-green-500' : 'bg-white')}
                 onClick={() => this.handleSelect(index)}>
                {this.props.renderFn(item, index)}
            </div>
        );
    }

    private isSelected(index: number) {
        return this.state.selected.indexOf(index) !== -1;
    }

    private handleSelect(index: number) {
        if (this.props.selectCount === 0) {
            return;
        }

        const selectedIndex = this.state.selected.indexOf(index);
        const selected = [...this.state.selected];

        if (selectedIndex !== -1) {
            // card is selected so unselect it
            selected.splice(selectedIndex, 1);
        } else {
            // card is not selected so select it
            if (selected.length === this.props.selectCount) {
                // we're at the max, so remove one of the selected cards first
                selected.pop();
            }
            selected.splice(selectedIndex, 0, index);
        }

        this.setState({
            selected: selected
        });
    }

    private handleClear() {
        this.setState({
            selected: []
        });
    }

    private handleDone() {
        if (this.props.doneCb) {
            this.props.doneCb(this.state.selected.map(i => this.props.available[i]));
        }
    }

    private handleCancel() {
        if (this.props.cancelCb) {
            this.props.cancelCb();
        }
    }
}
