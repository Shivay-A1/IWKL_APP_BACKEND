const express = require('express');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

const router = express.Router();

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        favoriteTeamId: true,
        favoritePlayerId: true,
        favoriteTeam: { select: { id: true, name: true, shortName: true, logo: true } },
        favoritePlayer: { select: { id: true, name: true, avatar: true } },
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Profile
router.put('/update', auth, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change Password
router.post('/change-password', auth, [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Set Favorite Team
router.post('/favorite-team', auth, async (req, res) => {
  try {
    const { teamId } = req.body;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { favoriteTeamId: teamId },
    });

    res.json({ message: 'Favorite team updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update favorite team' });
  }
});

// Set Favorite Player
router.post('/favorite-player', auth, async (req, res) => {
  try {
    const { playerId } = req.body;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { favoritePlayerId: playerId },
    });

    res.json({ message: 'Favorite player updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update favorite player' });
  }
});

// Update Player Registration Documents
router.put('/registration/documents', auth, async (req, res) => {
  try {
    const {
      registrationNumber,
      photoPath,
      aadhaarPath,
      ageProofPath,
      sportsCertificatePath,
      medicalCertificatePath,
      stateAssociationCertificatePath,
      additionalCertificatePath,
      videoHighlightsPath,
      signaturePath
    } = req.body;

    // Find the registration by number and verify it belongs to the user
    const registration = await prisma.playerRegistration.findFirst({
      where: {
        registrationNumber,
        userId: req.user.id
      }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found or does not belong to you' });
    }

    // Update only document fields
    const updatedRegistration = await prisma.playerRegistration.update({
      where: { id: registration.id },
      data: {
        ...(photoPath && { photoPath }),
        ...(aadhaarPath && { aadhaarPath }),
        ...(ageProofPath && { ageProofPath }),
        ...(sportsCertificatePath && { sportsCertificatePath }),
        ...(medicalCertificatePath && { medicalCertificatePath }),
        ...(stateAssociationCertificatePath && { stateAssociationCertificatePath }),
        ...(additionalCertificatePath && { additionalCertificatePath }),
        ...(videoHighlightsPath && { videoHighlightsPath }),
        ...(signaturePath && { signaturePath }),
      },
      select: {
        id: true,
        registrationNumber: true,
        photoPath: true,
        aadhaarPath: true,
        ageProofPath: true,
        sportsCertificatePath: true,
        medicalCertificatePath: true,
        stateAssociationCertificatePath: true,
        additionalCertificatePath: true,
        videoHighlightsPath: true,
        signaturePath: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Documents updated successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Error updating registration documents:', error);
    res.status(500).json({ error: 'Failed to update registration documents' });
  }
});

module.exports = router;
