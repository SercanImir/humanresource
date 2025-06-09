package com.project.humanresource.utility;

public enum StateTypes {
    Pending_Approval,   // The request has been submitted and is waiting for approval
    Approved,           // The request has been reviewed and accepted
    Rejected,           // The request has been reviewed and declined
    Cancelled           // The request was withdrawn or cancelled by the requester or system
}
