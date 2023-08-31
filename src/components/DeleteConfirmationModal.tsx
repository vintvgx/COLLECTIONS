import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

interface DeleteConfirmationModalProps {
  isVisible: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isVisible,
  onDelete,
  onCancel,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Delete Collection</Text>
          <Text style={styles.alertText}>
            Are you sure you want to delete this collection?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.cancelButtonContainer}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={styles.confirmButtonContainer}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  alertContainer: {
    width: 270,
    borderRadius: 13,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  alertText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 0.5,
    borderLeftColor: "grey",
  },
  cancelButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 0.5,
    borderRightColor: "grey",
  },
  confirmButtonText: {
    color: "green",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "red",
    fontSize: 16,
  },
});

export default DeleteConfirmationModal;
