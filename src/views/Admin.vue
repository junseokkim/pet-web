<template>
  <div class="admin-container">
    <h1>관리자 페이지</h1>
    
    <!-- 코드 그룹 섹션 -->
    <section class="code-groups">
      <div class="section-header">
        <h2>코드 그룹 관리</h2>
        <button @click="openNewGroupModal" class="add-button">
          <i class="fas fa-plus"></i> 새 그룹 추가
        </button>
      </div>

      <!-- 그리드를 스크롤 컨테이너로 변경 -->
      <div class="groups-scroll-container">
        <div class="groups-scroll">
          <div v-for="group in codeGroups" 
               :key="group.codeGroupId" 
               class="group-card"
               :class="{ active: selectedGroup?.codeGroupId === group.codeGroupId }"
               @click="selectGroup(group)">
            <div class="card-header">
              <h3>{{ group.codeGroupName }}</h3>
              <div class="card-actions">
                <button @click.stop="editGroup(group)" class="action-button edit">
                  수정
                </button>
                <button @click.stop="deleteGroup(group.codeGroupId)" class="action-button delete">
                  삭제
                </button>
              </div>
            </div>
            <p class="group-id">ID: {{ group.codeGroupId }}</p>
            <p class="description">{{ group.codeGroupDescription }}</p>
            <div class="card-footer">
              <span class="detail-count" v-if="group.detailCount">
                코드 {{ group.detailCount }}개
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 선택된 그룹의 코드 상세 섹션 -->
    <section v-if="selectedGroup" class="code-details">
      <div class="section-header">
        <div class="header-left">
          <h2>{{ selectedGroup.codeGroupName }}</h2>
          <span class="subtitle">상세 코드 목록</span>
        </div>
        <button @click="openNewDetailModal" class="add-button">
          <i class="fas fa-plus"></i> 새 코드 추가
        </button>
      </div>

      <!-- 테이블 형태의 코드 상세 목록 -->
      <div class="details-table-container">
        <table class="details-table">
          <thead>
            <tr>
              <th>코드 ID</th>
              <th>코드명</th>
              <th>값</th>
              <th>정렬 순서</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in codeDetails" :key="detail.codeDetailId">
              <td>{{ detail.codeDetailId }}</td>
              <td>{{ detail.codeDetailName }}</td>
              <td>{{ detail.codeDetailValue }}</td>
              <td>{{ detail.sortOrder }}</td>
              <td>
                <span :class="['status-badge', detail.isActive ? 'active' : 'inactive']">
                  {{ detail.isActive ? '활성' : '비활성' }}
                </span>
              </td>
              <td class="action-buttons">
                <button @click="editDetail(detail)" class="icon-button">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteDetail(detail.codeDetailId)" class="icon-button delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 모달 추가 -->
    <CodeGroupModal 
      v-if="showGroupModal"
      :groupData="editingGroup"
      @close="closeGroupModal"
      @submit="handleGroupSubmit"
    />
  </div>
</template>

<style scoped>
.admin-container {
  padding: 20px;
  max-width: 1200px;
  margin: 80px auto 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.subtitle {
  color: #666;
  font-size: 0.9em;
}

/* 그리드를 스크롤 컨테이너로 변경 */
.groups-scroll-container {
  width: 100%;
  margin-bottom: 40px;
  position: relative;
}

.groups-scroll {
  display: flex;
  gap: 20px;
  padding: 10px 0;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

/* 스크롤바 스타일링 */
.groups-scroll::-webkit-scrollbar {
  height: 8px;
}

.groups-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.groups-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.groups-scroll::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* 카드 크기 고정 */
.group-card {
  flex: 0 0 300px; /* 카드 너비 고정 */
  max-width: 300px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.group-card.active {
  border-color: #4CAF50;
  background-color: #f8fff8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.group-id {
  color: #666;
  font-size: 0.9em;
  margin: 4px 0;
}

.description {
  color: #444;
  margin: 8px 0;
  line-height: 1.4;
}

.card-footer {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.detail-count {
  color: #666;
  font-size: 0.9em;
}

/* 버튼 스타일 */
.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #45a049;
}

.icon-button {
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.icon-button:hover {
  color: #333;
}

.icon-button.delete:hover {
  color: #ff4444;
}

/* 테이블 스타일 */
.details-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
}

.details-table th,
.details-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.details-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.details-table tr:hover {
  background-color: #f8fff8;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #f5f5f5;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-button {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 0.9em;
}

.action-button.edit:hover {
  background-color: #f0f0f0;
}

.action-button.delete {
  color: #ff4444;
  border-color: #ff4444;
}

.action-button.delete:hover {
  background-color: #fff0f0;
}
</style>

<script>
import { ref, onMounted } from 'vue';
import { adminApi } from '@/api/admin';
import { useToast } from "vue-toastification";
import CodeGroupModal from '@/components/modals/CodeGroupModal.vue';

export default {
  components: {
    CodeGroupModal
  },

  setup() {
    const toast = useToast();
    const codeGroups = ref([]);
    const codeDetails = ref([]);
    const selectedGroup = ref(null);
    const showGroupModal = ref(false);
    const editingGroup = ref(null);

    const loadCodeGroups = async () => {
      try {
        const response = await adminApi.getCodeGroups();
        if (response.data.status === 'success') {
          codeGroups.value = response.data.data.codeGroupList;
        }
      } catch (error) {
        console.error('코드 그룹 로드 에러:', error);
        toast.error(error.response?.data?.message || '코드 그룹 로드 실패');
      }
    };

    const loadCodeDetails = async (groupId) => {
      try {
        const response = await adminApi.getCodeDetails(groupId);
        if (response.data.status === 'success') {
          codeDetails.value = response.data.data.codeDetailList;
        }
      } catch (error) {
        console.error('코드 상세 로드 에러:', error);
        toast.error(error.response?.data?.message || '코드 상세 로드 실패');
      }
    };

    const selectGroup = (group) => {
      selectedGroup.value = group;
      loadCodeDetails(group.codeGroupId);
    };

    const openNewGroupModal = () => {
      editingGroup.value = null;
      showGroupModal.value = true;
    };

    const editGroup = (group) => {
      editingGroup.value = group;
      showGroupModal.value = true;
    };

    const closeGroupModal = () => {
      showGroupModal.value = false;
      editingGroup.value = null;
    };

    const handleGroupSubmit = async (formData) => {
      if (!formData || typeof formData === 'object' && !formData.codeGroupName) {
        return;
      }

      try {
        let response;
        if (editingGroup.value) {
          const updateData = {
            codeGroupId: editingGroup.value.codeGroupId,
            codeGroupName: formData.codeGroupName,
            codeGroupDescription: formData.codeGroupDescription
          };
          response = await adminApi.updateCodeGroup(editingGroup.value.codeGroupId, updateData);
        } else {
          response = await adminApi.createCodeGroup(formData);
        }
        
        if (response.data.status === 'success') {
          toast.success(editingGroup.value ? '코드 그룹이 수정되었습니다.' : '코드 그룹이 추가되었습니다.');
          await loadCodeGroups();
          closeGroupModal();
        }
      } catch (error) {
        // 에러 객체에서 직접 message 추출
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('코드 그룹 저장에 실패했습니다.');
        }
      }
    };

    const deleteGroup = async (groupId) => {
      if (!confirm('정말 이 코드 그룹을 삭제하시겠습니까?')) {
        return;
      }

      try {
        const response = await adminApi.deleteCodeGroup(groupId);
        if (response.data.status === 'success') {
          toast.success('코드 그룹이 삭제되었습니다.');
          if (selectedGroup.value?.codeGroupId === groupId) {
            selectedGroup.value = null;
          }
          loadCodeGroups();
        }
      } catch (error) {
        console.log('삭제 에러:', error);
        // error.message에서 직접 메시지 추출 (수정과 동일한 방식)
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('코드 그룹 삭제에 실패했습니다.');
        }
      }
    };

    onMounted(() => {
      loadCodeGroups();
    });

    return {
      codeGroups,
      codeDetails,
      selectedGroup,
      showGroupModal,
      editingGroup,
      selectGroup,
      openNewGroupModal,
      editGroup,
      closeGroupModal,
      handleGroupSubmit,
      deleteGroup
    };
  }
};
</script> 