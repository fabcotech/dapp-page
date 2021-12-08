import React from 'react';
import showdown from 'showdown';

const converter = new showdown.Converter();

export class PageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tip: 0.01,
    };
  }

  render() {
    return (
      <div className="page-text-cont">
        <button
          className="button is-light is-medium"
          type="button"
          onClick={this.props.home}
        >
          Home
        </button>
        <br />
        <u>
          {dappy.dappyDomain}
          {dappy.path}
        </u>
        <div className="tip">
          <input
            className="input"
            type="number"
            step="0.01"
            min="0.01"
            value={this.state.tip}
            onChange={(e) => {
              if (typeof parseFloat(e.currentTarget.value) === 'number') {
                this.setState({ tip: parseFloat(e.currentTarget.value) });
              }
            }}
          ></input>
          <b>REV</b>
          <button
            disabled={typeof this.state.tip !== 'number'}
            type="button"
            className="button tip"
            onClick={() => {
              dappyRChain.requestPayment({
                amount: this.state.tip * 100000000,
                from: undefined,
                to: this.props.boxConfig.publicKey,
              });
            }}
          >
            tip page owner
          </button>
        </div>
        <div
          className="page-text"
          dangerouslySetInnerHTML={{
            __html: converter.makeHtml(this.props.text),
          }}
        ></div>
        <div className="bottom-buttons">
          <a
            className="button is-light is-medium"
            onClick={this.props.update}
          >
            Update page (admin only)
          </a>
          <a
            className="button is-light is-medium"
            onClick={this.props.create}
          >
            Create a new page
          </a>
        </div>
      </div>

    );
  }
}
