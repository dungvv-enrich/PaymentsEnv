function onApplePayButtonClicked() {
  if (!ApplePaySession) {
    return
  }

  // Define ApplePayPaymentRequest
  const request = {
    supportedMethods: "https://apple.com/apple-pay",
    data: 1,
    version: 14,
    merchantIdentifier: "merchant.identifier.example",
    countryCode: "US",
    currencyCode: "USD",
    displayName: "MyStore",
    initiative: "web",
    merchantCapabilities: ["supports3DS"],
    supportedNetworks: ["visa", "masterCard", "amex", "discover"],
    total: {
      label: "Demo (Card is not charged)",
      type: "final",
      amount: {
        value: "0.01",
        currency: "USD",
      },
    },
  }

  // Create ApplePaySession
  const session = new ApplePaySession(3, request)

  session.onvalidatemerchant = async event => {
    // Call your own server to request a new merchant session.
    const merchantSession = await validateMerchant()
    session.completeMerchantValidation(merchantSession)
  }

  session.onpaymentmethodselected = event => {
    console.log({ event })
    // Define ApplePayPaymentMethodUpdate based on the selected payment method.
    // No updates or errors are needed, pass an empty object.
    const update = {}
    session.completePaymentMethodSelection(update)
  }

  session.onshippingmethodselected = event => {
    // Define ApplePayShippingMethodUpdate based on the selected shipping method.
    // No updates or errors are needed, pass an empty object.
    const update = {}
    session.completeShippingMethodSelection(update)
  }

  session.onshippingcontactselected = event => {
    // Define ApplePayShippingContactUpdate based on the selected shipping contact.
    const update = {}
    session.completeShippingContactSelection(update)
  }

  session.onpaymentauthorized = event => {
    // Define ApplePayPaymentAuthorizationResult
    const result = {
      status: ApplePaySession.STATUS_SUCCESS,
    }
    session.completePayment(result)
  }

  session.oncouponcodechanged = event => {
    console.log({ event })
    // Define ApplePayCouponCodeUpdate
    const newTotal = calculateNewTotal(event.couponCode)
    const newLineItems = calculateNewLineItems(event.couponCode)
    const newShippingMethods = calculateNewShippingMethods(event.couponCode)
    const errors = calculateErrors(event.couponCode)

    session.completeCouponCodeChange({
      newTotal: newTotal,
      newLineItems: newLineItems,
      newShippingMethods: newShippingMethods,
      errors: errors,
    })
  }

  session.oncancel = event => {
    // Payment canceled by WebKit
  }

  session.begin()
}

if (!window.ApplePaySession) {
  $("#applePayButton_Area").remove()
}
