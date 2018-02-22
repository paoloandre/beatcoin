export function addFlashMessage(message) {
  return {
    type: "ADD_FLASH_MESSAGE",
    message // and we pass that message further down the pipe
  };
}

export function deleteFlashMessage() {
  return {
    type: "DELETE_FLASH_MESSAGE"
  };
}
