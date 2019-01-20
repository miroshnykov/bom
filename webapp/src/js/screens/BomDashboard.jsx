"use strict";

var AppDispatcher 	 = require("dispatcher/AppDispatcher");
var BomOverviewPanel = require("components/BomOverviewPanel.jsx");
var Dashboard 		 = require("components/Dashboard.jsx");
var FilePanel 		 = require("components/FilePanel.jsx");
var Panel 			 = require("components/Panel.jsx");
var React 			 = require("react");
var RfqModal 		 = require("components/modals/RfqModal.jsx");

module.exports = React.createClass({
	propTypes: {
	    bom: React.PropTypes.object.isRequired,
	},

    render: function() {
        return (
        	<div className="bom-dashboard">
	            <Dashboard model={this.props.bom}>
	            	<BomOverviewPanel bom={this.props.bom}/>
	            	<FilePanel model={this.props.bom} />
	            	<Panel title="RFQ">
	            		<p>
	            		One of BoM Squad's main features is connecting you to contract manufacturers.
	            		You can either browse them below or, if you've found what you're looking for,
	            		you can submit a request for quote.
	            		</p>
	            		<div className="rfq-buttons">
	            			<button className="btn btn-sm btn-link pull-left" onClick={this.onCm}>
	            				View Contract Manufacturers
	            			</button>
	            			<button className="btn btn-sm btn-primary pull-right" onClick={this.onRfq}>
	            				RFQ
	            			</button>
	            		</div>
	            	</Panel>
	            </Dashboard>
            </div>
        );
    },

    onRfq: function() {
    	AppDispatcher.dispatch({
    	    action: {
    	        type: "show-modal"
    	    },
    	    modal: (<RfqModal bom={this.props.bom} />)
    	});
    },

    onCm: function() {
    	window.location = "http://bomsquad.io/cm/";
    }

});
