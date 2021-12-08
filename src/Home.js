import React, { Fragment } from 'react';


export class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home">
        <br />
        <br />
        <h2 className="is-2 title">Personal page</h2>
        <p>Hi, welcome on dappy personal page. Personal page is a minimal on-chain
          blogging web application.
          <br />
          This dapp uses unique
          capabilities of dappy browser, RChain token as well as RChain
          smart contract platform.</p>
        <h4 className="is-4 title">Accessing friends's pages</h4>
        <p>You can access other's page if you know their contract and page ID <u>page?contract=paulcontract&page=index</u></p>
        <h4 className="is-4 title">Creating a new page</h4>
        <p>You can create any amount of page inside a NFT contract :
        </p>
        <ol>
          <li>{"Create a NFT contract using dappy -\> Deploy"}</li>
          <li>Deploy a page within the NFT contract by clicking on "Create new page" button below</li>
        </ol>
        {
          this.props.errorString &&
          <p className="body-error-2"><br />{this.props.errorString}</p>
        }
        <div className="bottom-buttons">
          <a
            className="button is-light is-medium"
            onClick={() => {
              this.props.create();
            }}
          >
            Create a new page
          </a>
        </div>
      </div>
    )
  }
}
